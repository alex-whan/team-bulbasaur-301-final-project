DROP TABLE IF EXISTS series;

CREATE TABLE series (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  overview TEXT,
  image_url VARCHAR(255),
  genres TEXT,
  rating VARCHAR(255),
  year VARCHAR(255),
  tmdbId NUMERIC,
  available_translations TEXT,
  comments TEXT,
  usernames TEXT,
  platforms TEXT
);

