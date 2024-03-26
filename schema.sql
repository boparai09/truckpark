-- schema.sql
CREATE TABLE IF NOT EXISTS truck_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS truck_sub_types (
    id SERIAL PRIMARY KEY,
    type_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    FOREIGN KEY (type_id) REFERENCES truck_types(id)
);

CREATE TABLE IF NOT EXISTS trucks (
    id SERIAL PRIMARY KEY,
    sub_type_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    description TEXT,
    FOREIGN KEY (sub_type_id) REFERENCES truck_sub_types(id),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE TABLE IF NOT EXISTS images (
    id SERIAL PRIMARY KEY,
    truck_id BIGINT NOT NULL,
    image_url VARCHAR(1024) NOT NULL,
    FOREIGN KEY (truck_id) REFERENCES trucks(id)
);
