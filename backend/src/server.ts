import express from "express";
import userRoutes from "./routes/userRoutes";
import formRoutes from "./routes/formRoutes";
import dotenv from "dotenv";
import cors from "cors";
import { handleRequest } from "./middlewares/dummy";

// Loading environment variables from .env file
dotenv.config();

// Express application
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:4200',
  methods: 'GET,POST,PUT,DELETE', 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); // Serves static files

// Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", formRoutes);
app.use("/api/v1", handleRequest);

// port
const PORT: number = parseInt(process.env.PORT || "3000", 10);

// Starting the Express app and listening for incoming requests
app.listen(PORT, () => {
  console.log(`[server]: Server is running on port ${PORT}`);
});