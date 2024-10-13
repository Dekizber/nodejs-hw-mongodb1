import createHttpError from 'http-errors';

import * as contactServices from '../services/contacts.js';

export const getContactsController = async (req, res) => {
    const data = await contactServices.getContacts();

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });
};

export const getContactByIdController = async (req, res, next) => {
    const { contactId } = req.params;
    const data = await contactServices.getContactById(contactId);

    if (!data) {
        throw createHttpError(404, `Contact not found`);
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data,
    });
};

export const addContactController = async (req, res) => {
    const data = await contactServices.addContact(req.body);

    res.status(201).json({
        status: 201,
        message: `Successfully created contact!`,
        data,
    });
};
