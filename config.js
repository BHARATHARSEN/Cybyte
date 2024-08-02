import mysql from 'mysql2';
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Loading environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

const connection = {
  database1: mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database1,
  }),
  database2: mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database2,
  }),
};

connection.connect((err) => {
    if(err) {
        console.error("Error connecting to the database:", err.stack);
        return;
    };
    console.log("Connected to the MySQL server.");
});

export default connection ;