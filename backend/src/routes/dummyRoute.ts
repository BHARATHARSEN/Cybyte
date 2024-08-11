import express from 'express';
import { handleRequest } from './dummy';

const router = express.Router();

// Define types for request and response objects
import { Request, Response } from 'express';

// Type definition for route handler
router.get('/switch', (req: Request, res: Response) => handleRequest(req, res));

export default router;