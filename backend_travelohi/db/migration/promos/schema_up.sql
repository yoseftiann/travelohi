CREATE TABLE IF NOT EXISTS "promos" (
    ID SERIAL PRIMARY KEY,
    Image VARCHAR(255) NOT NULL,
    Title VARCHAR(255),
    Description TEXT
)