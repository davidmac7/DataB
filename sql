CREATE TABLE aircraft_profiles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL
);


CREATE TABLE components (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    part_number VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) NOT NULL,
    comment TEXT,
    status VARCHAR(50) NOT NULL,
    category VARCHAR(1) CHECK (category IN ('X', 'R', 'A')), -- Ensures only X, R, or A
    image_path VARCHAR(255),
    aircraft_profile_id INTEGER REFERENCES aircraft_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    part_number VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) NOT NULL,
    comment TEXT,
    status VARCHAR(50) CHECK (status IN ('functioning', 'non-functioning')),
    

    SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'components';

ALTER TABLE components ALTER COLUMN status TYPE VARCHAR(20);

ALTER TABLE components ALTER COLUMN category TYPE VARCHAR(5);

