import express from 'express';
import * as userController from '../controllers/userController';
import auth from '../middlewares/auth';

const router = express.Router();

// Define types for request and response objects
import { Request, Response, NextFunction } from 'express';
import { handleRequest } from '../middlewares/dummy';

// Type definitions for route handlers
router.post('/register', handleRequest, (req: Request, res: Response) => userController.createUser(req, res));
router.post('/login', handleRequest, (req: Request, res: Response) => userController.loginUser(req, res));
router.post('/forgot-password',handleRequest, (req: Request, res: Response) => userController.forgotPassword(req, res));
router.post('/reset-password',handleRequest, (req: Request, res: Response) => userController.resetPassword(req, res));
router.put('/update/:id',auth,handleRequest, (req: Request, res: Response, next: NextFunction) => userController.updateUser(req, res));
router.delete('/delete/:id',auth,handleRequest, (req: Request, res: Response, next: NextFunction)  => userController.deleteUser(req, res));

export default router;

