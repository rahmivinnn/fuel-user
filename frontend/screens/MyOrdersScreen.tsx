import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { apiGetOrders } from '../services/api';
import LottieAnimation from '../components/LottieAnimation';
import loadingAnimation from '../assets/animations/loading.json';
import AnimatedPage from '../components/AnimatedPage';

type Tab = 'ongoing' | 'history';

// FIX: Added an interface for component props to fix key prop issue.
interface OrderCardProps {
    order: Order;
    type: Tab;
}

const OrderCard = ({ order, type }: OrderCardProps) => {
    return (
        <div className="bg-white p-5 rounded-2xl mb-4 shadow-lg border border-gray-100">
            <div className="flex items-center">
                <img 
                    src={order.fuelFriend?.avatarUrl || '/avatar.png'} 
                    alt={order.fuelFriend?.name || 'Fuel Friend'} 
                    className="w-16 h-16 rounded-full border-2 border-gray-200 shadow-sm"
                    onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='32' fill='%23e5e7eb'/%3E%3Cpath d='M32 16a8 8 0 1 0 0 16 8 8 0 0 0 0-16zM20 48a12 12 0 0 1 24 0H20z' fill='%23999'/%3E%3C/svg%3E";
                    }}
                />
                <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold text-[#3F4249] text-base">{order.fuelFriend?.name || 'Fuel Friend'}</p>
                            <p className="text-sm text-gray-600 flex items-center mt-1">
                                <MapPin size={14} className="mr-1 text-[#FF5630]" />
                                {order.fuelFriend?.location || order.deliveryAddress || 'Location'}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-gray-500 mb-1">Tracking no:</p>
                            <p className="text-sm font-semibold text-[#3AC36C]">{order.trackingNumber || order.trackingNo || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-5 flex space-x-3">
                {type === 'ongoing' ? (
                    <>
                        <button className="flex-1 bg-[#3AC36C] text-white py-3 rounded-full text-sm font-bold hover:bg-[#2ea85a] transition-all duration-200 active:scale-95 shadow-md">
                            Request Completed
                        </button>
                        <button className="flex-1 border-2 border-[#3AC36C] text-[#3AC36C] py-3 rounded-full text-sm font-bold hover:bg-[#3AC36C] hover:text-white transition-all duration-200 active:scale-95">
                            Dispute
                        </button>
                    </>
                ) : (
                    <button className={`w-full py-3 rounded-full text-sm font-bold transition-all duration-200 active:scale-95 ${
                        order.status === 'Completed' 
                            ? 'bg-green-50 text-green-700 border-2 border-green-200' 
                            : 'bg-red-50 text-red-700 border-2 border-red-200'
                    }`}>
                        {order.status}
                    </button>
                )}
            </div>
        </div>
    )
}

const MyOrdersScreen = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('ongoing');
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        if (!user) {
            setIsLoggedIn(false);
            setIsLoading(false);
            return;
        }
        
        setIsLoggedIn(true);
        
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                const data = await apiGetOrders();
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Show login prompt if not logged in
    if (!isLoggedIn) {
        return (
            <AnimatedPage>
                <div className="min-h-screen flex flex-col bg-white">
                    <header className="p-4 flex items-center sticky top-0 bg-white z-10">
                        <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-gray-100">
                            <img src="/Back.png" alt="Back" className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-bold text-center flex-grow -ml-10">My Orders</h2>
                    </header>
                    
                    <div className="flex-1 flex flex-col items-center justify-center px-4">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                    <circle cx="12" cy="7" r="4"/>
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Login Required</h3>
                            <p className="text-gray-600 mb-8 max-w-sm">
                                Please login to view your orders and track your fuel deliveries.
                            </p>
                            <button 
                                onClick={() => navigate('/login')}
                                className="bg-[#3AC36C] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#2ea85a] transition-colors"
                            >
                                Login Now
                            </button>
                        </div>
                    </div>
                </div>
            </AnimatedPage>
        );
    }

    const ongoingOrders = orders.filter(o => o.status === 'Ongoing');
    const historyOrders = orders.filter(o => o.status !== 'Ongoing');

    return (
        <AnimatedPage>
            <div className="min-h-screen flex flex-col bg-gray-50">
                <header className="p-4 flex items-center sticky top-0 bg-white z-10 shadow-sm">
                    <button onClick={() => navigate('/home')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                        <img src="/Back.png" alt="Back" className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-center flex-grow -ml-10 text-[#3F4249]">Manage Orders</h2>
                </header>

                <div className="px-4">
                    <div className="flex border-b-2 border-gray-200">
                        <button
                            onClick={() => setActiveTab('ongoing')}
                            className={`flex-1 py-4 font-bold transition-all duration-200 relative ${
                                activeTab === 'ongoing' 
                                    ? 'text-[#3AC36C] border-b-3 border-[#3AC36C]' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Ongoing
                            {activeTab === 'ongoing' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3AC36C] rounded-t-full"></div>
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`flex-1 py-4 font-bold transition-all duration-200 relative ${
                                activeTab === 'history' 
                                    ? 'text-[#3AC36C] border-b-3 border-[#3AC36C]' 
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            History
                            {activeTab === 'history' && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3AC36C] rounded-t-full"></div>
                            )}
                        </button>
                    </div>
                </div>

                <div className="p-4 flex-grow overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <LottieAnimation animationData={loadingAnimation} width={100} height={100} />
                        </div>
                    ) : (
                        activeTab === 'ongoing' ?
                            (ongoingOrders.length > 0 ? ongoingOrders.map(order => <OrderCard key={order.id} order={order} type="ongoing" />) : (
                                <div className="flex flex-col items-center mt-8">
                                    <p className="text-center text-gray-500 mt-2">No ongoing orders.</p>
                                </div>
                            ))
                            :
                            (historyOrders.length > 0 ? historyOrders.map(order => <OrderCard key={order.id} order={order} type="history" />) : (
                                <div className="flex flex-col items-center mt-8">
                                    <p className="text-center text-gray-500 mt-2">No past orders.</p>
                                </div>
                            ))
                    )}
                </div>
            </div>
        </AnimatedPage>
    );
};

export default MyOrdersScreen;
