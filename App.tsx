import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SplashScreen from './screens/SplashScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
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
import BottomNav from './components/BottomNav';
import { Theme, User } from './types';
import { apiLogin, apiLogout, apiLoginWithGoogleCredential, apiRegisterPushToken } from './services/api';

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

const AppNavigator = () => {
    const { isAuthenticated } = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();

    // Only redirect on initial load or auth state change, not on every location change
    useEffect(() => {
        const publicRoutes = ['/', '/splash', '/welcome', '/login', '/register'];
        const currentPath = location.pathname;
        
        // Only redirect if we're on a route that requires authentication state to match
        // and we're not already transitioning
        if (!window.location.hash.includes('#transition')) {
            if (isAuthenticated && (currentPath === '/' || currentPath === '/splash' || currentPath === '/welcome' || currentPath === '/login' || currentPath === '/register')) {
                navigate('/home');
            } else if (!isAuthenticated && currentPath !== '/' && currentPath !== '/splash' && currentPath !== '/welcome' && currentPath !== '/login' && currentPath !== '/register') {
                // Only redirect to splash screen if trying to access protected routes
                if (currentPath.startsWith('/home') || currentPath.startsWith('/station') || 
                    currentPath.startsWith('/checkout') || currentPath.startsWith('/track') || 
                    currentPath.startsWith('/orders') || currentPath.startsWith('/settings') || 
                    currentPath.startsWith('/profile')) {
                    navigate('/');
                }
            }
        }
    }, [isAuthenticated]); // Remove location.pathname from dependencies to prevent constant redirects


    const showBottomNav = isAuthenticated && ['/home', '/orders', '/track', '/settings'].includes(location.pathname);

    return (
        <div className="w-full h-full flex flex-col min-h-0 overflow-y-auto">
            <main className="flex-grow pb-20 md:pb-24 overflow-y-auto">
                <Routes>
                    <Route path="/" element={<SplashScreen />} />
                    <Route path="/welcome" element={<WelcomeScreen />} />
                    <Route path="/login" element={<LoginScreen />} />
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
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [user, setUser] = useState<User | null>({
        id: 'user-1',
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '',
        city: '',
        avatarUrl: '',
        vehicles: []
    });

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

    // Simple login function without Firebase
    const login = async (email: string, pass: string) => {
        try {
            // Call your API login function directly
            const userData = await apiLogin(email, pass);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    // Simple Google login function without Firebase
    const loginWithGoogle = async () => {
        try {
            // For now, we'll simulate a Google login
            // In a real implementation, you would integrate with Google's OAuth API directly
            const userData = {
                id: `user-${Date.now()}`,
                fullName: 'Google User',
                email: 'google.user@example.com',
                phone: '',
                city: '',
                avatarUrl: 'https://ui-avatars.com/api/?name=Google+User&background=random',
                vehicles: []
            };
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
        <AppContext.Provider value={{ theme, setTheme, isAuthenticated, user, login, loginWithGoogle, logout, updateUser }}>
            <div className="w-full h-full font-sans bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text" style={{ height: '100dvh', maxHeight: '100dvh', maxWidth: '100vw', paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <div className="w-full h-full bg-light-bg dark:bg-dark-bg overflow-y-auto" style={{ height: '100dvh', maxHeight: '100dvh' }}>
                    <HashRouter>
                        <AppNavigator />
                    </HashRouter>
                </div>
            </div>
        </AppContext.Provider>
    );
}

export default App;