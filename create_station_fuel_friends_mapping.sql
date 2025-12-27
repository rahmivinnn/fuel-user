-- Create station_fuel_friends mapping table for dynamic assignment
CREATE TABLE IF NOT EXISTS station_fuel_friends (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id VARCHAR NOT NULL REFERENCES fuel_stations(id) ON DELETE CASCADE,
    fuel_friend_id VARCHAR NOT NULL REFERENCES fuel_friends(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(station_id, fuel_friend_id)
);

-- Insert mappings for Jakarta stations
INSERT INTO station_fuel_friends (station_id, fuel_friend_id, is_active) VALUES
-- Shell Kemang
('station-1', 'ff-1', true),  -- Ahmad Rizki (Kemang area)
('station-1', 'ff-2', true),  -- Sari Dewi (Blok M - nearby)
('station-1', 'ff-5', true),  -- Andi Wijaya (Pondok Indah - nearby)

-- Pertamina Blok M  
('station-2', 'ff-2', true),  -- Sari Dewi (Blok M - same area)
('station-2', 'ff-1', true),  -- Ahmad Rizki (Kemang - nearby)
('station-2', 'ff-6', true),  -- Rina Sari (Gatot Subroto - nearby)

-- Total Senayan
('station-3', 'ff-3', true),  -- Budi Santoso (Senayan - same area)
('station-3', 'ff-4', true),  -- Maya Putri (Sudirman - nearby)
('station-3', 'ff-6', true),  -- Rina Sari (Gatot Subroto - nearby)

-- BP Sudirman
('station-4', 'ff-4', true),  -- Maya Putri (Sudirman - same area)
('station-4', 'ff-3', true),  -- Budi Santoso (Senayan - nearby)
('station-4', 'ff-6', true),  -- Rina Sari (Gatot Subroto - nearby)

-- Vivo Pondok Indah
('station-5', 'ff-5', true),  -- Andi Wijaya (Pondok Indah - same area)
('station-5', 'ff-1', true),  -- Ahmad Rizki (Kemang - nearby)
('station-5', 'ff-2', true),  -- Sari Dewi (Blok M - nearby)

-- Shell Gatot Subroto
('station-6', 'ff-6', true),  -- Rina Sari (Gatot Subroto - same area)
('station-6', 'ff-4', true),  -- Maya Putri (Sudirman - nearby)
('station-6', 'ff-3', true)   -- Budi Santoso (Senayan - nearby)
ON CONFLICT (station_id, fuel_friend_id) DO NOTHING;

-- Insert mappings for US stations
INSERT INTO station_fuel_friends (station_id, fuel_friend_id, is_active) VALUES
-- US stations with US fuel friends
('us-1', 'ff-us-1', true),   -- Shell Times Square -> John Smith (Manhattan)
('us-1', 'ff-us-2', true),   -- Shell Times Square -> Sarah Johnson (Times Square)
('us-2', 'ff-us-1', true),   -- BP Manhattan -> John Smith (Manhattan)
('us-2', 'ff-us-2', true),   -- BP Manhattan -> Sarah Johnson (Times Square)
('us-4', 'ff-us-3', true),   -- Chevron Hollywood -> Mike Davis (Hollywood)
('us-4', 'ff-us-4', true),   -- Chevron Hollywood -> Lisa Wilson (Beverly Hills)
('us-5', 'ff-us-4', true),   -- Shell Beverly Hills -> Lisa Wilson (Beverly Hills)
('us-5', 'ff-us-3', true),   -- Shell Beverly Hills -> Mike Davis (Hollywood)
('us-7', 'ff-us-5', true),   -- BP Chicago Loop -> David Brown (Chicago Loop)
('us-9', 'ff-us-6', true)    -- Shell South Beach -> Jennifer Garcia (South Beach)
ON CONFLICT (station_id, fuel_friend_id) DO NOTHING;

-- Insert mappings for UK stations  
INSERT INTO station_fuel_friends (station_id, fuel_friend_id, is_active) VALUES
-- UK stations with UK fuel friends
('uk-1', 'ff-uk-1', true),   -- Shell Oxford Street -> James Thompson (Oxford Street)
('uk-1', 'ff-uk-2', true),   -- Shell Oxford Street -> Emma Williams (Piccadilly)
('uk-2', 'ff-uk-2', true),   -- BP Piccadilly -> Emma Williams (Piccadilly)
('uk-2', 'ff-uk-1', true),   -- BP Piccadilly -> James Thompson (Oxford Street)
('uk-3', 'ff-uk-3', true),   -- Esso Tower Bridge -> Oliver Jones (Tower Bridge)
('uk-4', 'ff-uk-4', true),   -- Texaco Canary Wharf -> Sophie Brown (Canary Wharf)
('uk-5', 'ff-uk-5', true),   -- Shell Manchester -> Harry Wilson (Manchester)
('uk-7', 'ff-uk-6', true),   -- Esso Birmingham -> Charlotte Davis (Birmingham)
('uk-9', 'ff-uk-7', true),   -- BP Royal Mile -> William Miller (Edinburgh)
('uk-11', 'ff-uk-8', true)   -- Texaco Albert Dock -> Grace Taylor (Liverpool)
ON CONFLICT (station_id, fuel_friend_id) DO NOTHING;