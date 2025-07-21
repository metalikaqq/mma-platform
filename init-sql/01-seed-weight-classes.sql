-- Initial database seeding for MMA Platform
-- This script inserts common weight classes

-- Create UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert common MMA weight classes
INSERT INTO weight_classes (id, name, "minWeight", "maxWeight") VALUES
(gen_random_uuid(), 'Strawweight', 106, 115),
(gen_random_uuid(), 'Flyweight', 116, 125),
(gen_random_uuid(), 'Bantamweight', 126, 135),
(gen_random_uuid(), 'Featherweight', 136, 145),
(gen_random_uuid(), 'Lightweight', 146, 155),
(gen_random_uuid(), 'Welterweight', 156, 170),
(gen_random_uuid(), 'Middleweight', 171, 185),
(gen_random_uuid(), 'Light Heavyweight', 186, 205),
(gen_random_uuid(), 'Heavyweight', 206, 265)
ON CONFLICT (name) DO NOTHING;
