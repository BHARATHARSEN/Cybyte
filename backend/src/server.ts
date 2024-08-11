import express from "express";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";
import { handleRequest } from "./routes/dummy";

// Loading environment variables from .env file
dotenv.config();

// Express application
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", handleRequest);

// port
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Starting the Express app and listening for incoming requests
app.listen(PORT, () => {
  console.log(`[server]: Server is running on port ${PORT}`);
});