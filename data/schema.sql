DROP TABLE IF EXISTS series;

CREATE TABLE series (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  overview TEXT,
  image_url VARCHAR(255),
  genres TEXT,
  rating FLOAT,
  year NUMERIC,
  tmdbId NUMERIC,
  available_translations TEXT,
  comments TEXT,
  usernames TEXT
);

