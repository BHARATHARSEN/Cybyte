// import mysql from "mysql2/promise";
// import dotenv from "dotenv";

// dotenv.config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

// pool
//   .query("SELECT 1")
//   .then(() => {
//     console.log("Connected to the MySQL server.");
//   })
//   .catch((err) => {
//     console.error("Error connecting to the database:", err.stack);
//   });


// export default pool;

// src/config/database.ts
import mysql, {Pool} from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let cool : Pool;

export const createPool = (database : string) : Pool => {
  if(!cool){
    cool = mysql.createPool({
      host:
        database === "database1" ? process.env.DB1_HOST : process.env.DB2_HOST,
      port: 3336,
      user: process.env.DB_USERS,
      password:
        database === "database1"
          ? process.env.DB1_PASSWORD
          : process.env.DB2_PASSWORD,
      database: database,
    });
  }
  return cool;
};

export const getConnection = async (database : string) => {
  const pool = createPool(database);
  return await pool.getConnection();
};

const pool = mysql.createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool
  .query('SELECT 1')
  .then(() => {
    console.log(`Connected to the MySQL server ${process.env.DB_NAME}.`);
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.stack);
  });

export default pool;

