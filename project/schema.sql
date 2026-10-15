-- FlexFit Gym Maintenance Tracker
-- Database Schema for SQLite (flexfit.db)

DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS users;

-- Users table for staff login
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

-- Maintenance tickets table
CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    equipment TEXT NOT NULL,
    location TEXT NOT NULL,
    issue TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium',
    status TEXT NOT NULL DEFAULT 'Open',
    date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert test accounts
INSERT INTO users (username, password, role) VALUES 
('admin', 'password123', 'Manager'),
('staff1', 'gympass1', 'Staff');

-- Insert starter tickets
INSERT INTO tickets (equipment, location, issue, priority, status) VALUES 
('Treadmill 2', 'Cardio Area', 'Belt slipping at high speed', 'High', 'Open'),
('Rowing Machine 1', 'Main Gym Floor', 'Display screen not turning on', 'Medium', 'Open'),
('Cable Crossover', 'Free Weights Area', 'Right cable frayed near handle', 'High', 'Open'),
('Spin Bike 4', 'Studio 1', 'Resistance knob stuck', 'Low', 'Resolved'),
('Chest Press Machine', 'Resistance Area', 'Seat pin missing', 'Medium', 'Resolved');
