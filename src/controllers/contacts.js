import createHttpError from 'http-errors';

import * as contactServices from '../services/contacts.js';

import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByListContact } from '../db/models/Contact.js';

export const getContacts = async (req, res) => {
    const { page, perPage, sortBy, sortOrder } = req.query;

    // const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortByListContact });


    const data = await contactServices.getContacts({ page, perPage, sortBy, sortOrder });

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });
};

export const getContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const data = await contactServices.getContact({ _id: contactId, userId });

    if (!data) {
        throw createHttpError(404, `Contact not found`);
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data,
    });
};

export const addContact = async (req, res) => {
    const { _id: userId } = req.user;
    const data = await contactServices.addContact({ ...req.body, userId });

    res.status(201).json({
        status: 201,
        message: `Successfully created contact!`,
        data,
    });
};

// export const upsertContact = async (req, res) => {
//     const { contactId } = req.params;
// const { _id: userId } = req.user;
//     const { data, isNew } = await contactServices.updateContact({_id: contactId, userId}, {...req.body, userId}, { upsert: true });

//     const status = isNew ? 201 : 200;

//     res.status(status).json({
//         status: `${status}`,
//         message: `Successfully patched a contact!`,
//         data,
//     });
// };

export const patchContact = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const result = await contactServices.updateContact({ _id: contactId, userId }, req.body);

    if (!result) {
        throw createHttpError(404, `Contact not found`);
    }

    res.json({
        status: 200,
        message: `Successfully patched a contact!`,
        data: result.data,
    });
};

export const deleteContact = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const data = await contactServices.deleteContact({ _id: contactId, userId });

    if (!data) {
        throw createHttpError(404, `Contact not found`);
    }

    res.status(204).send();
};
