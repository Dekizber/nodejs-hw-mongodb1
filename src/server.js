import express from 'express';
import cors from 'cors';

import contactRouter from './routers/contacts.js';

import { env } from './utils/env.js';


export const setupServer = () => {
    const app = express();
    app.use(cors());

    app.use('/contacts', contactRouter);

    app.use((req, res) => {
        res.status(404).json({
            message: `Not found`
        });
    });

    app.use((error, req, res, next) => {
        res.status(500).json({
            message: error.message,
        });
    });

    const port = Number(env('PORT', 3000));

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

};



