import { Request, Response } from 'express';
import { createConnection } from '../config/database2';

export const getData = async (req: Request, res: Response) => {
  const { dbName } = req.query;

  if (!dbName || (dbName !== 'database1' && dbName !== 'database2')) {
    return res.status(400).json({ error: 'Invalid database selection' });
  }

  try {
    const connection = await createConnection(dbName as string);
    const [rows] = await connection.query('SELECT * FROM databaseInfo');
    console.log(`Query result from ${dbName}:`, rows);
    await connection.end(); // We are closing the connection
    return res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database query failed' });
  }
};
