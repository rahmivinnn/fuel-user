import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://apidecor.kelolahrd.life' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// ==========================================
// AUTHENTICATION
// ==========================================

export const apiLogin = async (emailOrPhone: string, password: string) => {
  const { data } = await api.post('/api/auth/login', { emailOrPhone, password });
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiRegisterStep1 = async (userData: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}) => {
  const { data } = await api.post('/api/auth/register/step1', userData);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiRegisterComplete = async (registrationData: {
  step1: {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
  };
  step2: {
    brand: string;
    color: string;
    licenseNumber: string;
    fuelType: string;
  };
}) => {
  const { data } = await api.post('/api/auth/register/complete', registrationData);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiGoogleAuth = async (googleData: {
  uid: string;
  email: string;
  displayName: string;
}) => {
  const { data } = await api.post('/api/auth/google', googleData);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiForgotPassword = async (emailOrPhone: string) => {
  const { data } = await api.post('/api/auth/forgot-password', { emailOrPhone });
  if (!data.success) throw new Error(data.message || data.error);
  return data;
};

export const apiResetPassword = async (email: string, password: string) => {
  const { data } = await api.post('/api/auth/reset-password', { email, password });
  if (!data.success) throw new Error(data.message || data.error);
  return data;
};

// ==========================================
// OTP SERVICES
// ==========================================

export const apiSendEmailOTP = async (email: string) => {
  const { data } = await api.post('/api/auth/otp/email/send', { email });
  if (!data.success) throw new Error(data.message || data.error);
  return data;
};

export const apiVerifyEmailOTP = async (email: string, otp: string) => {
  const { data } = await api.post('/api/auth/otp/email/verify', { email, otp });
  if (!data.success) throw new Error(data.message || data.error);
  return data;
};

export const apiSendWhatsAppOTP = async (phoneNumber: string) => {
  const { data } = await api.post('/api/auth/otp/whatsapp/send', { phoneNumber });
  if (!data.success) throw new Error(data.message || data.error);
  return data;
};

export const apiVerifyWhatsAppOTP = async (phoneNumber: string, otp: string) => {
  const { data } = await api.post('/api/auth/otp/whatsapp/verify', { phoneNumber, otp });
  if (!data.success) throw new Error(data.message || data.error);
  return data;
};

export const apiGetWhatsAppStatus = async () => {
  const { data } = await api.get('/api/auth/otp/whatsapp/status');
  return data;
};

// ==========================================
// FUEL STATIONS
// ==========================================

export const apiGetStations = async (lat: number, lng: number, radius = 10000) => {
  const { data } = await api.get(`/api/stations?lat=${lat}&lng=${lng}&radius=${radius}`);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiGetStationDetails = async (id: string) => {
  const { data } = await api.get(`/api/stations/${id}`);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiGetStationReviews = async (id: string, limit = 20) => {
  const { data } = await api.get(`/api/stations/${id}/reviews?limit=${limit}`);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiGetFuelFriendDetails = async (id: string) => {
  const { data } = await api.get(`/api/fuel-friends/${id}`);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiGetFuelFriendReviews = async (id: string, limit = 20) => {
  const { data } = await api.get(`/api/fuel-friends/${id}/reviews?limit=${limit}`);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiAddReview = async (reviewData: {
  customerId: string;
  stationId?: string;
  fuelFriendId?: string;
  rating: number;
  comment?: string;
}) => {
  const { data } = await api.post('/api/reviews', reviewData);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

// ==========================================
// ORDERS
// ==========================================

export const apiCreateOrder = async (orderData: {
  customerId: string;
  deliveryAddress: string;
  deliveryPhone: string;
  fuelType: string;
  fuelQuantity: string;
  totalAmount: string;
  deliveryFee: string;
  stationId?: string;
  fuelFriendId?: string;
  vehicleId?: string;
  groceriesCost?: string;
  orderType?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  estimatedDeliveryTime?: string;
  paymentMethod?: string;
}) => {
  const { data } = await api.post('/api/orders', orderData);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiGetOrders = async (customerId?: string, status?: string) => {
  let url = '/api/orders';
  const params = new URLSearchParams();
  
  if (customerId) params.append('customerId', customerId);
  if (status) params.append('status', status);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const { data } = await api.get(url);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

// ==========================================
// PAYMENTS
// ==========================================

export const apiCreatePaymentIntent = async (amount: number, currency: string, orderId: string) => {
  const { data } = await api.post('/api/payments/create-intent', {
    amount,
    currency,
    orderId
  });
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const apiRegisterFCMToken = async (customerId: string, token: string, deviceType?: string) => {
  const { data } = await api.post('/api/notifications/register-token', {
    customerId,
    token,
    deviceType
  });
  if (!data.success) throw new Error(data.message || data.error);
  return data;
};

export const apiGetNotifications = async (customerId: string) => {
  const { data } = await api.get(`/api/notifications/${customerId}`);
  if (!data.success) throw new Error(data.message || data.error);
  return data.data;
};

export const apiMarkNotificationAsRead = async (notificationId: string) => {
  const { data } = await api.put(`/api/notifications/${notificationId}/read`);
  if (!data.success) throw new Error(data.message || data.error);
  return data;
};

export const apiSendTestNotification = async (customerId: string) => {
  const { data } = await api.post('/api/notifications/test', { customerId });
  if (!data.success) throw new Error(data.message || data.error);
  return data;
};

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export const apiUpdateProfile = async (profileData: any) => {
  const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(profileData)
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to update profile');
  }
  
  return data.data;
};

export const apiChangePassword = async (customerId: string, currentPassword: string, newPassword: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customerId,
      currentPassword,
      newPassword
    })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to change password');
  }
  
  return data.data;
};

export const apiDeleteAccount = async (customerId: string, reason?: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/delete-account`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      customerId,
      reason
    })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to delete account');
  }
  
  return data.data;
};

export const apiHealthCheck = async () => {
  const { data } = await api.get('/api/health');
  return data;
};

export const apiLogout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

// ==========================================
// ERROR HANDLING
// ==========================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle standardized error responses
    const errorData = error.response?.data;
    if (errorData && !errorData.success) {
      const errorMessage = errorData.message || errorData.error || 'An error occurred';
      const responseCode = errorData.responseCode;
      
      // Handle specific response codes
      if (responseCode === 'RC_401' || responseCode === 'RC_A004') {
        // Unauthorized or token expired
        apiLogout();
        window.location.href = '/login';
      }
      
      // Throw error with standardized message
      const enhancedError = new Error(errorMessage);
      (enhancedError as any).responseCode = responseCode;
      return Promise.reject(enhancedError);
    }
    
    return Promise.reject(error);
  }
);

export default api;