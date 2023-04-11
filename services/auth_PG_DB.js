const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Sprint_2_CJN',
  password: 'jordan1234',
  port: 5433,
});
module.exports = pool;