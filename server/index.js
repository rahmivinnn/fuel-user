import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import { eq } from 'drizzle-orm';
import { db } from './db.js';
import { customers, vehicles, orders, fuelStations, products, fuelFriends } from '../shared/schema.js';
import otpService from './otp-service.js';
import otpRoutes from './routes/otp.routes.js';

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

// Orders endpoints
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
    const [newOrder] = await db.insert(orders).values({
      ...orderData,
      trackingNumber: `TRK-${Date.now()}`
    }).returning();
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Database error' });
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

// OTP routes
app.use('/api/otp', otpRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`FuelFriendly API running on port ${port} with PostgreSQL`);
});