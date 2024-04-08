const { Pool } = require('pg');

const pool = new Pool({
  user: 'tiberiucorici',
  host: 'localhost',
  database: 'testusers',
  password: '',
  port: 5432, // Default PostgreSQL port
});

module.exports = pool;
