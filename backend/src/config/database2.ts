import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const createConnection = async (database: string) => {
    const host = database === "database1" ? process.env.DB1_HOST : process.env.DB2_HOST;
    const user = process.env.DB_USERS;
    const password = database === "database1" ? process.env.DB1_PASSWORD : process.env.DB2_PASSWORD;
    const dbName = database === "database1" ? process.env.DB1_NAME : process.env.DB2_NAME;
  
    console.log(`Attempting to connect to ${database} on host ${host} with user ${user}`);
  
    try {
      const connection = await mysql.createConnection({
        host,
        port: 3336,
        user,
        password,
        database: dbName
      });
      console.log(`Successfully connected to ${database} (${dbName}) on host ${host}`);
      return connection;
    } catch (error) {
      console.error(`Failed to connect to ${database}:`, (error as Error).message);
      throw error;
    }
  };

// Testing connection
const testConnection = async () => {
  try {
    const connection = await createConnection('database1');
    console.log(`Connected to MySQL server: ${process.env.DB1_HOST}`);
    await connection.end();
  } catch (err: any) {
    console.error('Error connecting to the database:', err.stack);
  }
};

testConnection();

