import express from "express";
import dotenv from "dotenv";
import { expressjwt as jwt } from "express-jwt";
import jwksRsa from "jwks-rsa";
import axios from "axios";
import connection from "./config.js";


dotenv.config();
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const AUDIENCE = process.env.AUDIENCE;

// Middleware to validate JWT tokens
const jwtCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  }),
  audience: AUDIENCE,
  issuer: `https://${AUTH0_DOMAIN}/`,
  algorithms: ["RS256"],
}).unless({ path: ["/get-token", "/create-user"] });

app.use(jwtCheck);

// Route to obtain an access token
app.get("/get-token", async (req, res) => {
  try {
    const response = await axios.post(
      `https://${AUTH0_DOMAIN}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        audience: AUDIENCE,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).send("Error obtaining token");
  }
});

// Route to create a user
app.post("/create-user", async (req, res) => {
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

    res.json(userResponse.data);
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});

// Create a route for Home Page
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Importing and using connection to make a get query from our Database
app.get("/api/v1/users",(req, res) => {
  connection.query("SELECT * from users", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Fetching Data from different DB on basis of user
app.get("/api/v1/data",(req, res) => {
  const email = req.user.email;

  let database;

  if (email === "bcgrkofficial@gmail.com") {
    database = "database1";
  } else {
    database = "database2";
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

//Server is listening to the port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
