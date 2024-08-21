import express from 'express';
import * as formController from '../controllers/formController';


const router = express.Router();

// Define types for request and response objects
import { Request, Response} from 'express';
import { handleRequest } from '../middlewares/dummy';
import auth from '../middlewares/auth';

// Type definitions for route handlers
router.post('/form',auth,handleRequest, (req: Request, res: Response) => formController.submitForm(req, res));
router.get('/form', auth,handleRequest, (req: Request, res: Response) => formController.viewFormData(req, res));

export default router;