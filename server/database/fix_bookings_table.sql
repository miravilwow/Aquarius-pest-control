-- Fix bookings table - Add all missing columns
-- Run this if you get "column does not exist" errors

-- First, create bookings table if it doesn't exist
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

-- Add missing columns one by one (only if they don't exist)
DO $$ 
BEGIN
    -- Add 'name' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'name'
    ) THEN
        ALTER TABLE bookings ADD COLUMN name VARCHAR(100);
        RAISE NOTICE 'Added column: name';
    END IF;

    -- Add 'email' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'email'
    ) THEN
        ALTER TABLE bookings ADD COLUMN email VARCHAR(100);
        RAISE NOTICE 'Added column: email';
    END IF;

    -- Add 'phone' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'phone'
    ) THEN
        ALTER TABLE bookings ADD COLUMN phone VARCHAR(20);
        RAISE NOTICE 'Added column: phone';
    END IF;

    -- Add 'address' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'address'
    ) THEN
        ALTER TABLE bookings ADD COLUMN address TEXT;
        RAISE NOTICE 'Added column: address';
    END IF;

    -- Add 'service_id' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'service_id'
    ) THEN
        ALTER TABLE bookings ADD COLUMN service_id INTEGER REFERENCES services(id);
        RAISE NOTICE 'Added column: service_id';
    END IF;

    -- Add 'preferred_date' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'preferred_date'
    ) THEN
        ALTER TABLE bookings ADD COLUMN preferred_date DATE;
        RAISE NOTICE 'Added column: preferred_date';
    END IF;

    -- Add 'preferred_time' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'preferred_time'
    ) THEN
        ALTER TABLE bookings ADD COLUMN preferred_time TIME;
        RAISE NOTICE 'Added column: preferred_time';
    END IF;

    -- Add 'message' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'message'
    ) THEN
        ALTER TABLE bookings ADD COLUMN message TEXT;
        RAISE NOTICE 'Added column: message';
    END IF;

    -- Add 'status' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'status'
    ) THEN
        ALTER TABLE bookings ADD COLUMN status VARCHAR(20) DEFAULT 'pending';
        RAISE NOTICE 'Added column: status';
    END IF;

    -- Add 'created_at' column if missing
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE bookings ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
        RAISE NOTICE 'Added column: created_at';
    END IF;

END $$;

-- Create indexes if they don't exist (only if service_id column exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'service_id'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON bookings(service_id);
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'status'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    END IF;
    
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'created_at'
    ) THEN
        CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
    END IF;
END $$;

