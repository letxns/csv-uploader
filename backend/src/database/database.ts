import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('my-database.db');

db.run(`
  CREATE TABLE IF NOT EXISTS csv_data (
    id INTEGER PRIMARY KEY,
    name VARCHAR,
    city VARCHAR,
    country VARCHAR,
    favorite_sport VARCHAR
  );
`);

export default db;
