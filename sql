CREATE TABLE aircraft_profiles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  part_number TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  comment TEXT NOT NULL,
  status TEXT NOT NULL,
  category TEXT NOT NULL,
  document_path TEXT,
  photo_path TEXT,
  aircraft_id INTEGER REFERENCES aircraft_profiles(id) ON DELETE CASCADE
);
CREATE TABLE components (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    part_number VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) NOT NULL,
    comment TEXT,
    status VARCHAR(50) NOT NULL,
    image_path VARCHAR(255),
    aircraft_profile_id INTEGER REFERENCES aircraft_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
