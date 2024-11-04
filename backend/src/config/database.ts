import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pools: { [key: string]: Pool } = {};

//creating pool

export const createPool = (database: string): Pool => {
  if (!pools[database]) {
    pools[database] = mysql.createPool({
      host: database === "database1" ? process.env.DB1_HOST : process.env.DB2_HOST,
      port: 3336,
      user: process.env.DB_USERS,
      password: database === "database1" ? process.env.DB1_PASSWORD : process.env.DB2_PASSWORD,
      database: database === "database1" ? process.env.DB1_NAME : process.env.DB2_NAME, 
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pools[database];
};

export const getConnection = async (database: string) => {
  const pool = createPool(database);
  return await pool.getConnection();
};

// Testing the connection to database1
const testConnection = async () => {
  try {
    const connection = await getConnection('database1');
    console.log(`Connected to the MySQL server: ${process.env.DB1_HOST}`);
    connection.release();
  } catch (err : any) {
    console.error('Error connecting to the database:', err.stack);
  }
};

testConnection();

export default pools;
