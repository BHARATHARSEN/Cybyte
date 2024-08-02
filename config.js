import mysql from 'mysql2';
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// dotenv.config({ path: "./config.env" });


// Create a connection to the default database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DEFAULT_DATABASE, // Default database
});

connection.connect((err) => {
    if(err) {
        console.error("Error connecting to the database:", err.stack);
        return;
    };
    console.log("Connected to the MySQL server.");
});

export default connection ;