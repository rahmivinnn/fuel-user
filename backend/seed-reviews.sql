-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id VARCHAR NOT NULL REFERENCES customers(id),
    station_id VARCHAR REFERENCES fuel_stations(id),
    fuel_friend_id VARCHAR REFERENCES fuel_friends(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample fuel stations
INSERT INTO fuel_stations (id, name, address, latitude, longitude, regular_price, premium_price, diesel_price, rating, total_reviews, average_delivery_time) VALUES
('station-1', 'Petro Tennessee', 'Abcd Canada', 35.1495, -90.0490, 1.23, 1.75, 2.14, 4.7, 146, 30),
('station-2', 'Shell Downtown', '123 Main St, Memphis TN', 35.1174, -90.0505, 1.28, 1.80, 2.20, 4.5, 89, 25),
('station-3', 'BP Express', '456 Oak Ave, Memphis TN', 35.1320, -90.0420, 1.25, 1.78, 2.18, 4.6, 112, 35);

-- Insert sample products/groceries
INSERT INTO products (id, station_id, name, category, price, image, in_stock) VALUES
('prod-1', 'station-1', 'Snacks', 'Food', 16.19, '/image-card-1.png', true),
('prod-2', 'station-1', 'Water', 'Beverages', 16.19, '/image-card-1.png', true),
('prod-3', 'station-1', 'Bread', 'Food', 16.19, '/image-card-1.png', true),
('prod-4', 'station-2', 'Energy Drinks', 'Beverages', 12.99, '/image-card-1.png', true),
('prod-5', 'station-2', 'Chips', 'Food', 8.50, '/image-card-1.png', true);

-- Insert sample fuel friends
INSERT INTO fuel_friends (id, full_name, phone_number, email, location, delivery_fee, rating, total_reviews, latitude, longitude, profile_photo, about, is_available) VALUES
('friend-1', 'Shah Hussain', '+1234567890', 'shah.hussain@example.com', 'Abc Tennessee', 5.00, 4.8, 26, 35.1495, -90.0490, '/avatar.png', 'Fuel Friend is a reliable on-demand fuel delivery service designed to provide convenience and efficiency to customers. Whether you''re stranded on the road or simply looking to avoid the hassle of gas stations, our trusted Fuel Friends ensure that you get quality fuel delivered right to your location.', true),
('friend-2', 'Ahmed Ali', '+1234567891', 'ahmed.ali@example.com', 'Downtown Memphis', 4.50, 4.9, 34, 35.1174, -90.0505, '/avatar.png', 'Professional fuel delivery specialist with 3+ years experience. Fast, reliable, and always on time.', true),
('friend-3', 'Sarah Johnson', '+1234567892', 'sarah.johnson@example.com', 'Midtown Memphis', 5.50, 4.7, 18, 35.1320, -90.0420, '/avatar.png', 'Friendly and efficient fuel delivery service. Available 24/7 for emergency fuel needs.', true),
('friend-4', 'Mike Wilson', '+1234567893', 'mike.wilson@example.com', 'East Memphis', 4.75, 4.6, 22, 35.1180, -90.0370, '/avatar.png', 'Experienced fuel delivery professional serving Memphis area for over 2 years.', true);

-- Insert sample customers for reviews
INSERT INTO customers (id, full_name, email, phone_number, password, is_email_verified, profile_photo) VALUES
('customer-1', 'Saeed Ahmad', 'saeed@example.com', '+1111111111', 'password123', true, '/avatar.png'),
('customer-2', 'John Smith', 'john@example.com', '+2222222222', 'password123', true, '/avatar.png'),
('customer-3', 'Maria Garcia', 'maria@example.com', '+3333333333', 'password123', true, '/avatar.png'),
('customer-4', 'David Brown', 'david@example.com', '+4444444444', 'password123', true, '/avatar.png'),
('customer-5', 'Lisa Wilson', 'lisa@example.com', '+5555555555', 'password123', true, '/avatar.png');

-- Insert sample station reviews
INSERT INTO reviews (customer_id, station_id, rating, comment, created_at) VALUES
('customer-1', 'station-1', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.', NOW() - INTERVAL '2 days'),
('customer-2', 'station-1', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.', NOW() - INTERVAL '2 days'),
('customer-3', 'station-1', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.', NOW() - INTERVAL '2 days'),
('customer-4', 'station-1', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.', NOW() - INTERVAL '2 days'),
('customer-5', 'station-1', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.', NOW() - INTERVAL '2 days');

-- Insert sample fuel friend reviews
INSERT INTO reviews (customer_id, fuel_friend_id, rating, comment, created_at) VALUES
('customer-1', 'friend-1', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.', NOW() - INTERVAL '2 months'),
('customer-2', 'friend-1', 5, 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.', NOW() - INTERVAL '2 months'),
('customer-3', 'friend-2', 5, 'Excellent service! Very professional and quick delivery.', NOW() - INTERVAL '1 month'),
('customer-4', 'friend-2', 4, 'Good service, arrived on time as promised.', NOW() - INTERVAL '3 weeks'),
('customer-5', 'friend-3', 5, 'Amazing fuel friend! Highly recommended for emergency fuel needs.', NOW() - INTERVAL '1 week');

-- Update fuel friend ratings based on reviews
UPDATE fuel_friends SET 
    rating = (
        SELECT ROUND(AVG(rating::numeric), 1) 
        FROM reviews 
        WHERE fuel_friend_id = fuel_friends.id
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE fuel_friend_id = fuel_friends.id
    )
WHERE id IN (
    SELECT DISTINCT fuel_friend_id 
    FROM reviews 
    WHERE fuel_friend_id IS NOT NULL
);

-- Update station ratings based on reviews
UPDATE fuel_stations SET 
    rating = (
        SELECT ROUND(AVG(rating::numeric), 1) 
        FROM reviews 
        WHERE station_id = fuel_stations.id
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE station_id = fuel_stations.id
    )
WHERE id IN (
    SELECT DISTINCT station_id 
    FROM reviews 
    WHERE station_id IS NOT NULL
);