import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Trash2, CheckCircle, XCircle, Mail, User, CreditCard } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'account' | 'payment';
  title: string;
  message: string;
  time: string;
  section: 'Today' | 'Yesterday' | 'Last week';
}

const NotificationsScreen = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Your order arrived',
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      time: '2h ago',
      section: 'Today'
    },
    {
      id: '2',
      type: 'success',
      title: 'Your order arrived',
      message: 'Your payment of $XX.XX has been successfully processed.',
      time: '4h ago',
      section: 'Today'
    },
    {
      id: '3',
      type: 'error',
      title: 'Order Cancelled',
      message: 'Your recent order has been canceled. you can reorder.',
      time: '6h ago',
      section: 'Today'
    },
    {
      id: '4',
      type: 'info',
      title: 'Order Cancelled',
      message: 'Recently!',
      time: '1d ago',
      section: 'Yesterday'
    },
    {
      id: '5',
      type: 'account',
      title: 'Account setup',
      message: 'Your Account has been Setup Successful',
      time: '1d ago',
      section: 'Yesterday'
    },
    {
      id: '6',
      type: 'payment',
      title: 'Credit Card Connected',
      message: 'Credit card added ...',
      time: '1d ago',
      section: 'Yesterday'
    },
    {
      id: '7',
      type: 'info',
      title: 'Order Cancelled',
      message: 'Recently!',
      time: '1w ago',
      section: 'Last week'
    },
    {
      id: '8',
      type: 'account',
      title: 'Account setup',
      message: 'Your Account has been Setup Successful',
      time: '1w ago',
      section: 'Last week'
    },
    {
      id: '9',
      type: 'payment',
      title: 'Credit Card Connected',
      message: 'Credit card added ...',
      time: '1w ago',
      section: 'Last week'
    }
  ]);

  const [showDeleteMenu, setShowDeleteMenu] = useState<string | null>(null);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'info':
        return <Mail className="w-6 h-6 text-blue-500" />;
      case 'account':
        return <User className="w-6 h-6 text-gray-600" />;
      case 'payment':
        return <CreditCard className="w-6 h-6 text-orange-500" />;
      default:
        return <Mail className="w-6 h-6 text-gray-500" />;
    }
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    setShowDeleteMenu(null);
  };

  const groupedNotifications = notifications.reduce((acc, notification) => {
    if (!acc[notification.section]) {
      acc[notification.section] = [];
    }
    acc[notification.section].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2"
          >
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Notifications</h1>
          <div className="w-10"></div>
        </div>

        {/* Notifications List */}
        <div className="px-4 py-4">
          {Object.entries(groupedNotifications).map(([section, sectionNotifications]) => (
            <div key={section} className="mb-6">
              <h2 className="text-sm font-medium text-gray-500 mb-3">{section}</h2>
              <div className="space-y-3">
                {sectionNotifications.map((notification) => (
                  <div key={notification.id} className="relative">
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex-shrink-0 relative">
                        <button
                          onClick={() => setShowDeleteMenu(showDeleteMenu === notification.id ? null : notification.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        
                        {/* Delete Menu */}
                        {showDeleteMenu === notification.id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="flex items-center space-x-2 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span className="text-sm">Delete this notification</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default NotificationsScreen;