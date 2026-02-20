-- Create mosques table
CREATE TABLE IF NOT EXISTS mosques (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(100),
  country VARCHAR(100),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website VARCHAR(255),
  rating DECIMAL(3, 2) DEFAULT 0,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create prayer_times table
CREATE TABLE IF NOT EXISTS prayer_times (
  id SERIAL PRIMARY KEY,
  mosque_id INTEGER NOT NULL REFERENCES mosques(id) ON DELETE CASCADE,
  fajr TIME,
  dhuhr TIME,
  asr TIME,
  maghrib TIME,
  isha TIME,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: 12345)
-- Hash: $2b$10$kLXFi8U7J9K8XVxN3tN7l.4L4K8L4K8L4K8L4K8L4K8L4K8L4K8L
INSERT INTO admin (username, password_hash) VALUES ('admin', '$2b$10$kLXFi8U7J9K8XVxN3tN7l.4L4K8L4K8L4K8L4K8L4K8L4K8L4K8L')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mosques_city ON mosques(city);
CREATE INDEX IF NOT EXISTS idx_mosques_country ON mosques(country);
CREATE INDEX IF NOT EXISTS idx_prayer_times_mosque_id ON prayer_times(mosque_id);
