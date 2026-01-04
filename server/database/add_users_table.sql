-- Add users table for customer authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for email lookup
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Update services table to use property types instead of pest types
-- First, let's update existing services
UPDATE services SET 
    name = 'Residential Area',
    description = 'Comprehensive pest control for residential properties including homes, apartments, and condominiums',
    price = 150.00
WHERE name = 'Ant Control';

UPDATE services SET 
    name = 'Commercial Building',
    description = 'Professional pest control services for commercial establishments, offices, and retail spaces',
    price = 200.00
WHERE name = 'Roach Control';

UPDATE services SET 
    name = 'Industrial Building',
    description = 'Specialized pest control solutions for industrial facilities, warehouses, and manufacturing plants',
    price = 250.00
WHERE name = 'Rodent Control';

UPDATE services SET 
    name = 'School',
    description = 'Safe and effective pest control services for educational institutions and school facilities',
    price = 300.00
WHERE name = 'Termite Control';








