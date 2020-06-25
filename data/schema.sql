DROP TABLE IF EXISTS series;

CREATE TABLE series (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  overview TEXT,
  image_url VARCHAR(255),
  genres TEXT,
  rating VARCHAR(255),
  year VARCHAR(255),
  tmdbId VARCHAR(255),
  available_translations TEXT,
  comments TEXT,
  usernames TEXT,
  platforms TEXT,
  runtime VARCHAR(255),
  traktid VARCHAR(255)
);

