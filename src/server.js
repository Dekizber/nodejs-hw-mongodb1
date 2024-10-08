import express from 'express';
import cors from 'cors';

import * as contactServices from './services/contacts.js';

import { env } from './utils/env.js';


export const setupServer = () => {
    const app = express();
    app.use(cors());

    app.get('/contacts', async (req, res) => {
        const data = await contactServices.getContacts();
        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data,
        });
    });

    app.get('/contacts/:contactId', async (req, res) => {
        const { contactId } = req.params;
        const data = await contactServices.getContactById(contactId);

        if (!data) {
            return res.status(404).json({
                status: 404,
                message: `Contact not found`
            });
        }

        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data,
        });
    });


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



