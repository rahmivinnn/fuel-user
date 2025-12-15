import { User, Station, Order } from '../types';

export const apiLogin = async (email: string, pass: string): Promise<User> => {
    throw new Error('Use Firebase login');
};

export const apiLogout = () => {
    localStorage.removeItem('authToken');
};

export const apiRegister = async (data: any): Promise<User> => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const payload: Partial<User> = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        city: data.city || '',
        avatarUrl: data.avatarUrl || '',
        vehicles: [{
            id: `v-${Date.now()}`,
            brand: data.vehicleBrand,
            color: data.vehicleColor,
            licenseNumber: data.licenseNumber,
            fuelType: data.fuelType
        }]
    } as any;
    const res = await fetch(`${base}/api/user/me?email=${encodeURIComponent(data.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to save profile');
    return await res.json();
};

export const apiGetStations = async (lat: number, lon: number): Promise<Omit<Station, 'groceries' | 'fuelFriends'>[]> => {
    const radius = 10000;
    const query = `[out:json];node[amenity=fuel](around:${radius},${lat},${lon});out;`;
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const url = base ? `${base}/api/stations?lat=${lat}&lon=${lon}&radius=${radius}` : `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`Failed to fetch stations: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();

        const toKm = (aLat: number, aLon: number, bLat: number, bLon: number) => {
            const R = 6371e3;
            const dLat = (bLat - aLat) * Math.PI / 180;
            const dLon = (bLon - aLon) * Math.PI / 180;
            const sa = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * Math.PI / 180) * Math.cos(bLat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
            const c = 2 * Math.atan2(Math.sqrt(sa), Math.sqrt(1 - sa));
            return (R * c) / 1000;
        };

        const stations = (data.elements || []).map((el: any, idx: number) => {
            const name = el.tags?.name || 'Fuel Station';
            const address = [el.tags?.street, el.tags?.city].filter(Boolean).join(', ') || 'Nearby';
            const distKm = el.lat && el.lon ? toKm(lat, lon, el.lat, el.lon) : 0;

            // Generate a more realistic image URL based on the station name
            const imageName = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            const imageUrl = `https://source.unsplash.com/300x300/?gas-station,${imageName}`;

            return {
                id: `osm-${el.id || idx}`,
                name,
                address,
                distance: distKm ? `${distKm.toFixed(1)} km` : '',
                deliveryTime: '10-15 min',
                rating: 0,
                reviewCount: 0,
                imageUrl,
                bannerUrl: `https://source.unsplash.com/600x300/?gas-station,${imageName}`,
                logoUrl: imageUrl,
                fuelPrices: { regular: NaN, premium: NaN, diesel: NaN },
                lat: el.lat || lat,
                lon: el.lon || lon
            } as Omit<Station, 'groceries' | 'fuelFriends'>;
        });

        // Sort stations by distance (closest first)
        stations.sort((a, b) => {
            const distA = parseFloat(a.distance) || 0;
            const distB = parseFloat(b.distance) || 0;
            return distA - distB;
        });

        return stations;
    } catch (error) {
        return [];
    }
};

export const apiGetStationDetails = async (id: string): Promise<Station> => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/api/station/${id}`);
    if (!res.ok) throw new Error('Failed to fetch station details');
    const st = await res.json();
    // Mock data for a more realistic experience
    st.groceries = [
        { id: 'g1', name: 'Mineral Water', price: 1.50, imageUrl: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=100&h=100&fit=crop' },
        { id: 'g2', name: 'Potato Chips', price: 2.50, imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100&h=100&fit=crop' },
        { id: 'g3', name: 'Energy Bar', price: 3.00, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&h=100&fit=crop' },
        { id: 'g4', name: 'Coffee', price: 4.50, imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100&h=100&fit=crop' }
    ];

    st.fuelFriends = [
        { id: 'f1', name: 'John Driver', rate: 15.00, rating: 4.9, reviewCount: 124, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop' },
        { id: 'f2', name: 'Sarah Spark', rate: 14.50, rating: 4.8, reviewCount: 89, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop' },
        { id: 'f3', name: 'Mike Moto', rate: 16.00, rating: 5.0, reviewCount: 42, avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop' }
    ];
    return st;
};

export const apiGetOrders = async (): Promise<Order[]> => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/api/orders`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    return await res.json();
}

export const apiCreateOrder = async (order: Order): Promise<Order> => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    });
    if (!res.ok) throw new Error('Failed to create order');
    return await res.json();
}

export const apiUpdateOrderStatus = async (id: string, status: Order['status']): Promise<Order | null> => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    if (!res.ok) return null;
    return await res.json();
}

export const apiUpdateUserProfile = async (userData: User): Promise<User> => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/api/user/me?email=${encodeURIComponent(userData.email)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return await res.json();
}

export const apiRegisterPushToken = async (email: string | undefined, token: string): Promise<{ ok: boolean }> => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/api/notifications/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token })
    });
    if (!res.ok) throw new Error('Failed to register push token');
    return await res.json();
}

export const apiSendTestPush = async (token?: string): Promise<{ ok: boolean } | { error: string }> => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/api/notifications/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(token ? { token } : {})
    });
    try { return await res.json(); } catch { return { ok: false } as any }
}

const decodeJwt = (token: string): any => {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(atob(payload).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    try { return JSON.parse(json); } catch { return null; }
};

export const apiLoginWithGoogleCredential = async (credential: string): Promise<User> => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const res = await fetch(`${base}/api/auth/firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credential })
    });
    if (!res.ok) throw new Error('Failed to authenticate');
    return await res.json();
}
