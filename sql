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

CREATE TABLE IF NOT EXISTS defects (
    id SERIAL PRIMARY KEY,
    component_id INT,
    defect_name TEXT,
    elimination_method TEXT,
    work_date DATE,
    performer_name TEXT,
    master_name TEXT,
    qc_name TEXT,
    signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )

CREATE TABLE IF NOT EXISTS signatures (
    id SERIAL PRIMARY KEY,
    component_id INT NOT NULL,
    performer_signature_path TEXT NOT NULL,
    master_signature_path TEXT NOT NULL,
    qc_signature_path TEXT NOT NULL,
    technical_signature_path TEXT NOT NULL
  );

  ALTER TABLE signatures
ADD CONSTRAINT fk_defect
FOREIGN KEY (defect_id) REFERENCES defects(defect_id) ON DELETE CASCADE;

ALTER TABLE signatures
ADD CONSTRAINT fk_defect
FOREIGN KEY (defect_id) REFERENCES defects(defect_id) ON DELETE CASCADE;

ALTER TABLE signatures ADD COLUMN signature_date DATE;

DELETE FROM defects WHERE id IN (1, 2, 3);
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    id_number VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Store hashed password
    role VARCHAR(50) NOT NULL CHECK (role IN ('X', 'R', 'A', 'Admin')), -- Define valid roles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optionally, create an index for id_number to speed up searches
CREATE INDEX idx_id_number ON roles (id_number);

CREATE TABLE signaturesz (
    id SERIAL PRIMARY KEY,
    component_id INT NOT NULL,
    defect_name TEXT NOT NULL,
    elimination_method TEXT NOT NULL,
    date_work_done DATE NOT NULL,
    performer_name TEXT NOT NULL,
    master_name TEXT NOT NULL,
    qc_name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performer_signature_path TEXT,
    master_signature_path TEXT,
    qc_signature_path TEXT,
    technical_signature_path TEXT,
    FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
);

ALTER TABLE aircraft_profiles DROP COLUMN signature;
