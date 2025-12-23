import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import MobileDebugger from './components/MobileDebugger';

// Import pages from fuel-user-update structure
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import HomeScreen from './screens/HomeScreen';
import StationDetailsScreen from './screens/StationDetailsScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import TrackOrderScreen from './screens/TrackOrderScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import SettingsScreen from './screens/SettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PaymentScreen from './screens/PaymentScreen';
import OrderSummaryScreen from './screens/OrderSummaryScreen';
import ProfileScreen from './screens/ProfileScreen';
import PasswordResetSuccess from './components/PasswordResetSuccess';
import BottomNav from './components/BottomNav';
import { Theme, User } from './types';

// API functions
const apiLogin = async (email: string, password: string) => {
  const response = await fetch(`https://apidecor.kelolahrd.life/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (!data.success) throw new Error(data.error);
  return data.user;
};

const apiLogout = () => {
  // Clear any stored tokens/session data
  localStorage.removeItem('user');
};

const apiLoginWithGoogleCredential = async () => {
  // Simulate Google login for now
  return {
    id: `user-${Date.now()}`,
    fullName: 'Google User',
    email: 'google.user@example.com',
    phone: '',
    city: '',
    avatarUrl: 'https://ui-avatars.com/api/?name=Google+User&background=random',
    vehicles: []
  };
};

interface AppContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
    updateUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

const queryClient = new QueryClient();

const AppNavigator = () => {
    const { isAuthenticated } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const publicRoutes = ['/', '/login', '/register', '/forgot-password'];
        const currentPath = location.pathname;
        
        if (isAuthenticated && publicRoutes.includes(currentPath)) {
            navigate('/home');
        } else if (!isAuthenticated && !publicRoutes.includes(currentPath)) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const showBottomNav = isAuthenticated && ['/home', '/orders', '/track', '/settings'].includes(location.pathname);

    return (
        <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto">
            <main className="flex-grow pb-20 md:pb-24 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<SplashScreen />} />
                    <Route path="/login" element={<LoginScreen />} />
                    <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                    <Route path="/password-reset-success" element={<PasswordResetSuccess />} />
                    <Route path="/register" element={<RegistrationScreen />} />
                    <Route path="/home" element={<HomeScreen />} />
                    <Route path="/station/:id" element={<StationDetailsScreen />} />
                    <Route path="/checkout" element={<CheckoutScreen />} />
                    <Route path="/order-summary" element={<OrderSummaryScreen />} />
                    <Route path="/payment" element={<PaymentScreen />} />
                    <Route path="/track" element={<TrackOrderScreen />} />
                    <Route path="/orders" element={<MyOrdersScreen />} />
                    <Route path="/notifications" element={<NotificationsScreen />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                </Routes>
            </main>
            {showBottomNav && <BottomNav />}
        </div>
    )
}

const App = () => {
    const [theme, setThemeState] = useState<Theme>(Theme.LIGHT);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === Theme.DARK) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        if (newTheme === Theme.DEFAULT) {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeState(prefersDark ? Theme.DARK : Theme.LIGHT);
        } else {
            setThemeState(newTheme);
        }
    };

    const login = async (email: string, pass: string) => {
        try {
            const userData = await apiLogin(email, pass);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const loginWithGoogle = async () => {
        try {
            const userData = await apiLoginWithGoogleCredential();
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Google login error:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            apiLogout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        if (updatedUser) setIsAuthenticated(true);
    }

    return (
        <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={{ theme, setTheme, isAuthenticated, user, login, loginWithGoogle, logout, updateUser }}>
                <div className="w-full h-full font-sans bg-white text-gray-900" style={{ height: '100dvh', maxHeight: '100dvh', maxWidth: '100vw' }}>
                    <Toaster
                        position="top-center"
                        toastOptions={{
                            className: 'ios-toast',
                            style: {
                                background: 'rgba(255, 255, 255, 0.9)',
                                color: '#000000',
                                border: 'none',
                                borderRadius: '25px',
                                fontSize: '15px',
                                fontWeight: '500',
                                padding: '12px 24px',
                                backdropFilter: 'blur(12px)',
                                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                                width: 'auto',
                                minWidth: '300px',
                                marginBottom: '16px',
                            },
                            duration: 3000,
                        }}
                    />
                    <div className="w-full h-full bg-white overflow-y-auto" style={{ height: '100dvh', maxHeight: '100dvh' }}>
                        <BrowserRouter>
                            <AppNavigator />
                        </BrowserRouter>
                        <MobileDebugger />
                    </div>
                </div>
            </AppContext.Provider>
        </QueryClientProvider>
    );
}

export default App;