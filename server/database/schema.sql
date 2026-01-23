-- Create database (run this manually in PostgreSQL)
-- CREATE DATABASE pest_control;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    service_id INTEGER REFERENCES services(id),
    preferred_date DATE NOT NULL,
    preferred_time TIME NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Note: Default admin will be created by init.js script with proper bcrypt hash

-- Insert default services (only when table is empty)
INSERT INTO services (name, description, price)
SELECT * FROM (VALUES
  ('Ant Control', 'Effective ant elimination and prevention', 150.00),
  ('Roach Control', 'Complete roach removal services', 200.00),
  ('Rodent Control', 'Safe rodent removal and prevention', 250.00),
  ('Termite Control', 'Professional termite treatment', 300.00)
) AS t(name, description, price)
WHERE NOT EXISTS (SELECT 1 FROM services);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);

