import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { logger } from './middlewares/logger.js';

import authRouter from './routers/auth.js';
import contactRouter from './routers/contacts.js';

import { UPLOAD_DIR } from './constants/index.js';

import { env } from './utils/env.js';

import { swaggerDocs } from './middlewares/swaggerDocs.js';

export const setupServer = () => {
    const app = express();
    app.use(cors());
    // app.use(logger);
    app.use(express.json());
    app.use(cookieParser());
    app.use('/uploads', express.static(UPLOAD_DIR));
    app.use('/uploads', express.static(UPLOAD_DIR));
    app.use('/api-docs', swaggerDocs());

    app.use('/auth', authRouter);
    app.use('/contacts', contactRouter);

    app.use(notFoundHandler);

    app.use(errorHandler);

    const port = Number(env('PORT', 3000));

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

};



