import { messaging, getToken, onMessage } from './firebase';
import { apiRegisterFCMToken } from './api';

class PushNotificationService {
  private vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  
  async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async getRegistrationToken(): Promise<string | null> {
    try {
      if (!messaging) {
        console.warn('Firebase messaging not available');
        return null;
      }

      if (!this.vapidKey) {
        console.warn('VAPID key not configured');
        return null;
      }

      const token = await getToken(messaging, {
        vapidKey: this.vapidKey
      });
      
      console.log('FCM Registration Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting registration token:', error);
      return null;
    }
  }

  async initializePushNotifications(customerId?: string): Promise<string | null> {
    try {
      // Check if notifications are supported
      if (!('Notification' in window)) {
        console.warn('This browser does not support notifications');
        return null;
      }

      // Request permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn('Notification permission denied');
        return null;
      }

      // Get registration token
      const token = await this.getRegistrationToken();
      
      if (token && customerId) {
        // Register token with backend
        await this.registerTokenWithBackend(customerId, token);
        
        // Listen for foreground messages
        this.setupForegroundMessageListener();
        
        // Register service worker for background messages
        this.registerServiceWorker();
      }

      return token;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return null;
    }
  }

  private async registerTokenWithBackend(customerId: string, token: string) {
    try {
      const deviceType = this.getDeviceType();
      await apiRegisterFCMToken(customerId, token, deviceType);
      console.log('FCM token registered with backend');
    } catch (error) {
      console.error('Error registering FCM token with backend:', error);
    }
  }

  private getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) return 'android';
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'ios';
    return 'web';
  }

  private setupForegroundMessageListener() {
    if (!messaging) return;

    onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      // Show notification when app is in foreground
      if (payload.notification) {
        this.showNotification(
          payload.notification.title || 'FuelFriendly',
          payload.notification.body || '',
          payload.notification.icon || '/logo.png'
        );
      }
    });
  }

  private async registerServiceWorker() {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered:', registration);
      }
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private showNotification(title: string, body: string, icon?: string) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: icon || '/logo.png',
        badge: '/logo.png',
        tag: 'fuelfriendly-notification'
      });
    }
  }

  async sendTestNotification(): Promise<boolean> {
    try {
      // This would typically be called from backend
      // For demo purposes, show a local notification
      this.showNotification(
        'Test Notification',
        'Push notifications are working!',
        '/logo.png'
      );
      return true;
    } catch (error) {
      console.error('Error sending test notification:', error);
      return false;
    }
  }

  getPermissionStatus(): NotificationPermission {
    return Notification.permission;
  }

  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }
}

export const pushNotificationService = new PushNotificationService();