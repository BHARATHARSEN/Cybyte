import { Request, Response, NextFunction } from 'express';
import { getConnection } from '../config/database';
import { setDatabase } from '../helpers/datbaseContext';

export const handleRequest = (req: Request, res: Response, next:NextFunction): void => {
    const { id = '' } = req.body; // Default to '' if id is undefined

    console.log(req.body);

    // Determining the database based on the id
    let database: string;
    switch (id) {
        case '':
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
            // res.send('Operation successful');
            next();
        })
        .catch(error => {
            console.error(`Error connecting to ${database}:`, error);
            res.status(500).send('Database operation failed');
        });
};