require('dotenv').config();
const path = require('path');
const BASE_PATH = path.join(__dirname, 'db');

module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST || '0.0.0.0',
      port: process.env.POSTGRES_PORT || '5432',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'diagrams',
    },
    pool: {
      min: 0,
      max: 50,
    },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  docker: {
    client: 'pg',
    connection: {
      host: 'diagrams_core_db',
      user: 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: 'diagrams',
    },
    pool: {
      min: 0,
      max: 50,
    },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
};
