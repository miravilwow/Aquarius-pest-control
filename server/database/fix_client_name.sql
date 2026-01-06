-- Fix bookings table - Check if client_name column exists
-- If client_name exists but name doesn't, rename client_name to name
-- OR if both exist, drop client_name

DO $$ 
BEGIN
    -- Check if client_name column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bookings' AND column_name = 'client_name'
    ) THEN
        -- If name column also exists, drop client_name
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'bookings' AND column_name = 'name'
        ) THEN
            ALTER TABLE bookings DROP COLUMN client_name;
            RAISE NOTICE 'Dropped duplicate client_name column (name column exists)';
        ELSE
            -- Rename client_name to name
            ALTER TABLE bookings RENAME COLUMN client_name TO name;
            RAISE NOTICE 'Renamed client_name to name';
        END IF;
    END IF;
END $$;













