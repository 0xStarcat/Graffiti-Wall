DROP TABLE IF EXISTS images;

DROP TABLE IF EXISTS publicGraffiti CASCADE;
DROP TABLE IF EXISTS userScreenshots CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS graffitiLogs CASCADE;

CREATE TABLE publicGraffiti (
  id SERIAL PRIMARY KEY,
  row VARCHAR NOT NULL,
  col VARCHAR NOT NULL,
  imageURL TEXT
  );

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(256) UNIQUE NOT NULL,
  hashed_password VARCHAR NOT NULL,
  walls VARCHAR[]
  );

CREATE TABLE userScreenshots (
id SERIAL PRIMARY KEY,
owner VARCHAR REFERENCES users(username),
imageURL TEXT
);

CREATE TABLE graffitiLogs (
  id SERIAL PRIMARY KEY,
  username VARCHAR REFERENCES users(username),
  date_posted VARCHAR,
  message VARCHAR (256)
);
