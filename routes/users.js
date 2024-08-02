import express from "express";
import axios from "axios";
import connection from "../config.js";

const router = express.Router();

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;

// Middleware to parse JSON requests
router.use(express.json());

// Route to create a user
router.post("/create-user", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Get access token
    const tokenResponse = await axios.get("http://localhost:3000/get-token");
    const accessToken = tokenResponse.data.access_token;

    // Create user
    const userResponse = await axios.post(
      `https://${AUTH0_DOMAIN}/api/v2/users`,
      {
        email: email,
        password: password,
        connection: "Username-Password-Authentication",
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Inserting to the database after creating a user.

    connection.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password],
      (err, results) => {
        if (err) {
          console.error("Error inserting user into database:", err);
          res.status(500).send("Error inserting user into database");
          return;
        }
        console.log("User inserted into database:", results);
        res.json(userResponse.data);
      }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send("Error creating user");
  }
});

// Route to change user email address
router.post("/update-email", async (req, res) => {
  const { userId, newEmail } = req.body;

  try {
    // Get access token
    const tokenResponse = await axios.get("http://localhost:3000/get-token");
    const accessToken = tokenResponse.data.access_token;

    // Update user email
    const response = await axios.patch(
      `https://${AUTH0_DOMAIN}/api/v2/users/${userId}`,
      {
        email: newEmail,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error updating email", error);
  }
});

// Importing and using connection to make a get query from our Database
router.get("/users", (req, res) => {
  connection.query("SELECT * from users", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Route to get a user by ID (GET)
router.get('/users/:id', (req, res) => {
  const { id } = req.params;

  connection.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Error fetching user');
      return;
    }
    if (results.length === 0) {
      res.status(404).send('User not found');
      return;
    }
    res.json(results[0]);
  });
});

/ Route to update a user by ID (PUT)
router.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  connection.query(
    'UPDATE users SET email = ?, password = ? WHERE id = ?',
    [email, password, id],
    (err, results) => {
      if (err) {
        console.error('Error updating user:', err);
        res.status(500).send('Error updating user');
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).send('User not found');
        return;
      }
      res.send('User updated successfully');
    }
  );
});


// Fetching Data from different DB on basis of user
router.get("/data", (req, res) => {
  const email = req.user.email;

  let database;

  if (email === "bcgrkofficial@gmail.com") {
    database = "database1";
  } else if (email === "chenchabharath@gmail.com") {
    database = "database2";
  } else {
    return res.status(403).send("Unauthorized");
  }

  const query = `USE ??; SELECT * FROM data`;

  connection.query(query, [database], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      res.status(500).json({ error: "Database query error" });
      return;
    }
    res.json(results);
  });
});

export default router;
