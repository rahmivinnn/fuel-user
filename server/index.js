import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { eq } from 'drizzle-orm';
import { db } from './db.js';
import { customers, vehicles, orders, fuelStations, products, fuelFriends } from '../shared/schema.js';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'FuelFriendly API Server',
    status: 'running',
    version: '1.0.0'
  });
});

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok' });
});

// Registration endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, vehicleBrand, vehicleColor, licenseNumber, fuelType } = req.body;
    
    if (!fullName || !email || !phoneNumber || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const existingUser = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
    
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const [newUser] = await db.insert(customers).values({
      fullName,
      email,
      phoneNumber,
      password,
      profilePhoto: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`
    }).returning();
    
    // Create vehicle if provided
    if (vehicleBrand) {
      await db.insert(vehicles).values({
        customerId: newUser.id,
        brand: vehicleBrand,
        color: vehicleColor,
        licenseNumber,
        fuelType,
        isPrimary: true
      });
    }
    
    res.json({ success: true, user: { id: newUser.id, email: newUser.email, fullName: newUser.fullName } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User endpoints
app.get('/api/user/me', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'email required' });
    
    const user = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
    if (!user.length) return res.status(404).json({ error: 'not_found' });
    
    const userVehicles = await db.select().from(vehicles).where(eq(vehicles.customerId, user[0].id));
    
    res.json({
      ...user[0],
      vehicles: userVehicles
    });
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.patch('/api/user/me', async (req, res) => {
  try {
    const { email } = req.query;
    const payload = req.body;
    
    if (!email) return res.status(400).json({ error: 'email required' });
    
    const existingUser = await db.select().from(customers).where(eq(customers.email, email)).limit(1);
    
    if (!existingUser.length) {
      // Create new user
      const [newUser] = await db.insert(customers).values({
        fullName: payload.fullName,
        email: payload.email,
        phoneNumber: payload.phone || '',
        password: payload.password || 'temp',
        city: payload.city || '',
        profilePhoto: payload.avatarUrl
      }).returning();
      
      // Create vehicle if provided
      if (payload.vehicles && payload.vehicles.length > 0) {
        const vehicle = payload.vehicles[0];
        await db.insert(vehicles).values({
          customerId: newUser.id,
          brand: vehicle.brand,
          color: vehicle.color,
          licenseNumber: vehicle.licenseNumber,
          fuelType: vehicle.fuelType,
          isPrimary: true
        });
      }
      
      res.json(newUser);
    } else {
      // Update existing user
      const [updatedUser] = await db.update(customers)
        .set({
          fullName: payload.fullName,
          phoneNumber: payload.phone,
          city: payload.city,
          profilePhoto: payload.avatarUrl
        })
        .where(eq(customers.id, existingUser[0].id))
        .returning();
      
      res.json(updatedUser);
    }
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// Stations endpoint
app.get('/api/stations', async (req, res) => {
  try {
    const { lat, lon, radius = 10000 } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'lat and lon required' });
    }
    
    // Get stations from database or fallback to Overpass API
    const dbStations = await db.select().from(fuelStations).limit(10);
    
    if (dbStations.length > 0) {
      res.json({ elements: dbStations.map(station => ({
        id: station.id,
        lat: parseFloat(station.latitude || '0'),
        lon: parseFloat(station.longitude || '0'),
        tags: {
          name: station.name,
          street: station.address
        }
      }))});
    } else {
      // Fallback to Overpass API
      const query = `[out:json];node[amenity=fuel](around:${radius},${lat},${lon});out;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      res.json(data);
    }
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch stations' });
  }
});

// Station details
app.get('/api/station/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to get from database first
    const station = await db.select().from(fuelStations).where(eq(fuelStations.id, id)).limit(1);
    
    if (station.length > 0) {
      const stationProducts = await db.select().from(products).where(eq(products.stationId, id));
      const stationFriends = await db.select().from(fuelFriends).limit(3);
      
      res.json({
        ...station[0],
        groceries: stationProducts,
        fuelFriends: stationFriends
      });
    } else {
      // Fallback to OSM data
      const osmId = id.startsWith('osm-') ? id.replace('osm-', '') : id;
      const query = `[out:json];node(${osmId});out;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      const el = data.elements?.[0];
      
      if (!el) return res.status(404).json({ error: 'not_found' });
      
      res.json({
        id: `osm-${el.id}`,
        name: el.tags?.name || 'Fuel Station',
        address: el.tags?.street || 'Nearby',
        lat: el.lat,
        lon: el.lon,
        groceries: [],
        fuelFriends: []
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'failed to fetch station' });
  }
});

// Seed data endpoint
app.post('/api/seed', async (req, res) => {
  try {
    // Seed customers first
    const customersData = [
      {
        id: 'customer-1',
        fullName: 'John Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        password: 'password123',
        isEmailVerified: true
      }
    ];

    // Seed fuel stations
    const stationsData = [
      {
        id: 'station-1',
        name: 'Petro Tennessee',
        address: 'Abcd Tennessee',
        latitude: '-6.200000',
        longitude: '106.816666',
        regularPrice: '1.23',
        premiumPrice: '1.75',
        dieselPrice: '2.14',
        rating: '4.7',
        totalReviews: 146,
        averageDeliveryTime: 30
      },
      {
        id: 'station-2', 
        name: 'Shell Express',
        address: 'Downtown Area',
        latitude: '-6.210000',
        longitude: '106.826666',
        regularPrice: '1.25',
        premiumPrice: '1.78',
        dieselPrice: '2.16',
        rating: '4.5',
        totalReviews: 89,
        averageDeliveryTime: 25
      }
    ];

    // Seed products
    const productsData = [
      { id: 'prod-1', stationId: 'station-1', name: 'Snacks', category: 'Food', price: '16.19', inStock: true },
      { id: 'prod-2', stationId: 'station-1', name: 'Water', category: 'Drinks', price: '16.19', inStock: true },
      { id: 'prod-3', stationId: 'station-1', name: 'Bread', category: 'Food', price: '16.19', inStock: true }
    ];

    // Seed fuel friends
    const fuelFriendsData = [
      {
        id: 'ff-1',
        fullName: 'Shah Hussain',
        phoneNumber: '+1234567890',
        email: 'shah@example.com',
        location: 'Tennessee',
        deliveryFee: '5.00',
        rating: '4.8',
        totalReviews: 46,
        latitude: '-6.200000',
        longitude: '106.816666',
        about: 'Experienced fuel delivery driver'
      }
    ];

    // Insert data in correct order (customers first)
    await db.insert(customers).values(customersData).onConflictDoNothing();
    await db.insert(fuelStations).values(stationsData).onConflictDoNothing();
    await db.insert(products).values(productsData).onConflictDoNothing();
    await db.insert(fuelFriends).values(fuelFriendsData).onConflictDoNothing();

    res.json({ success: true, message: 'Seed data inserted successfully' });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to seed data' });
  }
});
app.get('/api/orders', async (req, res) => {
  try {
    const allOrders = await db.select().from(orders);
    res.json(allOrders);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const trackingNumber = `TRK-${Date.now()}`;
    
    const [newOrder] = await db.insert(orders).values({
      trackingNumber,
      customerId: orderData.customerId || 'customer-1',
      stationId: orderData.stationId || 'station-1',
      fuelFriendId: orderData.fuelFriendId,
      vehicleId: orderData.vehicleId,
      deliveryAddress: orderData.deliveryAddress,
      deliveryPhone: orderData.deliveryPhone,
      fuelType: orderData.fuelType,
      fuelQuantity: orderData.fuelQuantity,
      fuelCost: orderData.fuelCost,
      deliveryFee: orderData.deliveryFee,
      groceriesCost: orderData.groceriesCost || '0',
      totalAmount: orderData.totalAmount,
      orderType: orderData.orderType || 'instant',
      scheduledDate: orderData.scheduledDate,
      scheduledTime: orderData.scheduledTime,
      estimatedDeliveryTime: orderData.estimatedDeliveryTime,
      status: 'pending',
      paymentStatus: 'completed',
      paymentMethod: orderData.paymentMethod || 'credit_card'
    }).returning();
    
    res.status(201).json({ success: true, order: newOrder, trackingId: trackingNumber });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Geocoding endpoint
app.get('/api/geocode', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.status(400).json({ error: 'q required' });
    return;
  }
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'fuelfriendly' } });
    if (!r.ok) {
      res.status(r.status).json({ error: r.statusText });
      return;
    }
    const data = await r.json();
    const item = Array.isArray(data) && data.length ? data[0] : null;
    if (!item) {
      res.status(404).json({ error: 'not_found' });
      return;
    }
    res.json({ lat: parseFloat(item.lat), lon: parseFloat(item.lon), display_name: item.display_name });
  } catch (e) {
    res.status(500).json({ error: 'failed to geocode' });
  }
});

// Import WhatsApp service
import whatsappService from './whatsapp-service.js';
import { promises as fs } from 'fs';
import path from 'path';

// Function to check WhatsApp status from file
const checkWhatsAppStatus = async () => {
  try {
    const statusFile = path.join(process.cwd(), 'server', 'whatsapp-status.json');
    const data = await fs.readFile(statusFile, 'utf8');
    const status = JSON.parse(data);
    // Check if status is recent (within 2 minutes)
    const isRecent = (Date.now() - status.lastUpdate) < 120000;
    return status.isConnected && isRecent;
  } catch (error) {
    return false;
  }
};

// WhatsApp OTP endpoints
app.post('/api/otp/whatsapp/send', async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
    
    // Check if WhatsApp is connected via status file
    const isConnected = await checkWhatsAppStatus();
    if (!isConnected) {
      return res.status(500).json({ error: 'WhatsApp not connected' });
    }
    
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Write OTP request to file for daemon to process
    const requestFile = path.join(process.cwd(), 'server', 'otp-request.json');
    const request = {
      phoneNumber,
      otp,
      timestamp: Date.now(),
      processed: false
    };
    
    await fs.writeFile(requestFile, JSON.stringify(request));
    
    // Wait for processing (max 10 seconds)
    let processed = false;
    for (let i = 0; i < 20; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      try {
        const data = await fs.readFile(requestFile, 'utf8');
        const status = JSON.parse(data);
        if (status.processed) {
          processed = true;
          if (status.error) {
            throw new Error(status.error);
          }
          break;
        }
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    
    if (!processed) {
      throw new Error('WhatsApp OTP timeout');
    }
    
    // Store OTP in memory
    global.otpStore = global.otpStore || {};
    global.otpStore[phoneNumber] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    };
    
    res.json({ 
      success: true, 
      message: 'OTP sent via WhatsApp',
      expiresIn: 300
    });
  } catch (error) {
    console.error('WhatsApp OTP send error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/otp/whatsapp/verify', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, error: 'Phone number and OTP are required' });
    }
    
    // Check stored OTP
    const storedData = global.otpStore?.[phoneNumber];
    if (!storedData) {
      return res.json({ success: false, error: 'OTP not found' });
    }
    
    if (Date.now() > storedData.expires) {
      delete global.otpStore[phoneNumber];
      return res.json({ success: false, error: 'OTP expired' });
    }
    
    if (storedData.otp !== otp) {
      return res.json({ success: false, error: 'Invalid OTP' });
    }
    
    // OTP verified, clean up
    delete global.otpStore[phoneNumber];
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('WhatsApp OTP verify error:', error);
    res.json({ success: false, error: 'Failed to verify WhatsApp OTP' });
  }
});

// Email OTP endpoints
app.post('/api/otp/email/send', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory
    global.emailOtpStore = global.emailOtpStore || {};
    global.emailOtpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    };
    
    res.json({ 
      success: true, 
      message: 'OTP sent to email',
      otp: otp // Remove in production
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email OTP' });
  }
});

// Alternative endpoint for frontend compatibility
app.post('/api/resend/contact', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP in memory
    global.emailOtpStore = global.emailOtpStore || {};
    global.emailOtpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    };
    
    res.json({ 
      success: true, 
      message: 'Verification code sent successfully',
      otp: otp // For testing - remove in production
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email OTP' });
  }
});

app.post('/api/otp/email/verify', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, error: 'Email and OTP are required' });
    }
    
    // Check stored OTP
    const storedData = global.emailOtpStore?.[email];
    if (!storedData) {
      return res.json({ success: false, error: 'OTP not found' });
    }
    
    if (Date.now() > storedData.expires) {
      delete global.emailOtpStore[email];
      return res.json({ success: false, error: 'OTP expired' });
    }
    
    if (storedData.otp !== otp) {
      return res.json({ success: false, error: 'Invalid OTP code' });
    }
    
    // OTP verified, clean up
    delete global.emailOtpStore[email];
    res.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.json({ success: false, error: 'Failed to verify email OTP' });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`FuelFriendly API running on port ${port} with PostgreSQL`);
  console.log('Note: WhatsApp service should be running separately via PM2');
});