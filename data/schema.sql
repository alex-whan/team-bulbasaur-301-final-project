DROP TABLE IF EXISTS series;

CREATE TABLE series (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  img_url VARCHAR(255)
);