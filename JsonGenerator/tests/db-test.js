require('dotenv').config();
const db = require('../src/config/db');

async function testConnection() {
  try {
    const client = await db.getClient();
    console.log('Successfully connected to Neon database!');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('Query result:', result.rows[0]);
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

testConnection();