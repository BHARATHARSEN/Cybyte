// import express from "express";
// import * as userController from "../controllers/userController.ts";
// import auth from "../middlewares/auth.ts";

// const router = express.Router();

// router.post("/register", userController.createUser);
// router.post("/login", userController.loginUser);
// router.post("/forgot-password", userController.forgotPassword);
// router.post("/reset-password", userController.resetPassword);
// router.put("/update/:id", auth, userController.updateUser);
// router.delete("/delete/:id", auth, userController.deleteUser);

// export default router;

import express from 'express';
import * as userController from '../controllers/userController';
import auth from '../middlewares/auth';

const router = express.Router();

// Define types for request and response objects
import { Request, Response, NextFunction } from 'express';

// Type definitions for route handlers
router.post('/register', (req: Request, res: Response) => userController.createUser(req, res));
router.post('/login', (req: Request, res: Response) => userController.loginUser(req, res));
router.post('/forgot-password', (req: Request, res: Response) => userController.forgotPassword(req, res));
router.post('/reset-password', (req: Request, res: Response) => userController.resetPassword(req, res));
router.put('/update/:id', (req: Request, res: Response, next: NextFunction) => auth(req, res, next), (req: Request, res: Response) => userController.updateUser(req, res));
router.delete('/delete/:id', (req: Request, res: Response, next: NextFunction) => auth(req, res, next), (req: Request, res: Response) => userController.deleteUser(req, res));

export default router;

