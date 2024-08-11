import { Request, Response } from 'express';
import { getConnection } from '../config/database';
import { setDatabase } from '../helpers/datbaseContext';

export const handleRequest = (req: Request, res: Response): void => {
    const id = req.query.id as string;

    // Determine the database based on the id
    let database: string;
    switch (id) {
        case '1':
            database = 'database1';
            break;
        case '2':
            database = 'database2';
            break;
        default:
            res.status(400).send('Invalid id parameter');
            return;
    }

    setDatabase(database);

    console.log(`Connecting to database: ${database}`);

    getConnection(database)
        .then(connection => {
            console.log(`Successfully connected to ${database}`);

            connection.release();
            res.send('Operation successful');
        })
        .catch(error => {
            console.error(`Error connecting to ${database}:`, error);
            res.status(500).send('Database operation failed');
        });
};