import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, ".env") });

const router = express.Router();

// Middleware to parse JSON requests
router.use(express.json());

// Create a new MySQL connection for database3
const getConnection = () => {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "database3", // Use the dynamic database name
  });
};

// Route to create a worker
router.post("/create-worker", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const connection = getConnection();
    connection.connect((err) => {
      if (err) {
        console.error("Error connecting to the database:", err);
        res.status(500).send("Error connecting to the database");
        return;
      }

      // Insert user into the selected database
      connection.query(
        "CALL InsertWorker(?, ?, ?)",
        [name, email, password],
        (err, results) => {
          if (err) {
            console.error("Error inserting user into database:", err);
            res.status(500).send("Error inserting user into database");
            return;
          }
          console.log("Worker inserted into database:", results);
          res.json(results);

          // Close the connection after the query
          connection.end();
        }
      );
    });
  } catch (error) {
    console.error("Error creating worker:", error);
    res.status(500).send("Error creating worker");
  }
});

// Route to get all users
router.get("/workers", (req, res) => {
  const connection = getConnection();
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Error connecting to the database");
      return;
    }

    connection.query("CALL GetAllWorkers()", (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        res.status(500).send("Error fetching users");
        return;
      }
      res.json(results);

      // Close the connection after the query
      connection.end();
    });
  });
});

// Route to get a user by ID
router.get("/workers/:id", (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Error connecting to the database");
      return;
    }

    connection.query(
      'CALL GetWorkerById(?)',
      [id],
      (err, results) => {
        if (err) {
          console.error("Error fetching worker:", err);
          res.status(500).send("Error fetching worker");
          return;
        }
        if (results.length === 0) {
          res.status(404).send("Worker not found");
          return;
        }
        res.json(results[0]);

        // Close the connection after the query
        connection.end();
      }
    );
  });
});

// Route to update a user by ID
router.put("/workers/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const connection = getConnection();
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Error connecting to the database");
      return;
    }

    connection.query(
      "CALL UpdateWorker(?, ?, ?, ?)",
      [name, email, password, id],
      (err, results) => {
        if (err) {
          console.error("Error updating worker:", err);
          res.status(500).send("Error updating worker");
          return;
        }
        if (results.affectedRows === 0) {
          res.status(404).send("worker not found");
          return;
        }
        res.send("worker updated successfully");

        // Close the connection after the query
        connection.end();
      }
    );
  });
});

// Route to delete a user by ID
router.delete("/workers/:id", (req, res) => {
  const { id } = req.params;
  const connection = getConnection();
  connection.connect((err) => {
    if (err) {
      console.error("Error connecting to the database:", err);
      res.status(500).send("Error connecting to the database");
      return;
    }

    connection.query("CALL DeleteWorker(?)", [id], (err, results) => {
      if (err) {
        console.error("Error deleting worker:", err);
        res.status(500).send("Error deleting worker");
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send("worker not found");
        return;
      }
      res.send("worker deleted successfully");

      // Close the connection after the query
      connection.end();
    });
  });
});

export default router;
