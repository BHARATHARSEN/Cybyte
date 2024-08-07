import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .query("SELECT 1")
  .then(() => {
    console.log("Connected to the MySQL server.");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.stack);
  });


export default pool;
