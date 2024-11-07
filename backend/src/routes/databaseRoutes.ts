import { Router } from 'express';
import { getData } from '../controllers/databaseController';

const router = Router();

router.get('/data', getData);

export default router;
