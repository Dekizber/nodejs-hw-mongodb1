import createHttpError from 'http-errors';

import * as contactServices from '../services/contacts.js';
import { contactAddScheme } from '../validation/contacts.js';

export const getContacts = async (req, res) => {
    const data = await contactServices.getContacts();

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });
};

export const getContactById = async (req, res, next) => {
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

export const addContact = async (req, res) => {
    const validateBody = contactAddScheme.validate(req.body, { abortEartly: false, });
    console.log(validateBody);

    // const data = await contactServices.addContact(req.body);

    // res.status(201).json({
    //     status: 201,
    //     message: `Successfully created contact!`,
    //     data,
    // });
};

// export const upsertContact = async (req, res) => {
//     const { contactId } = req.params;
//     const { data, isNew } = await contactServices.updateContactById(contactId, req.body, { upsert: true });

//     const status = isNew ? 201 : 200;

//     res.status(status).json({
//         status: `${status}`,
//         message: `Successfully patched a contact!`,
//         data,
//     });
// };

export const patchContact = async (req, res) => {
    const { contactId } = req.params;
    const result = await contactServices.updateContactById(contactId, req.body);

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
    const data = await contactServices.deleteContactById(contactId);

    if (!data) {
        throw createHttpError(404, `Contact not found`);
    }

    res.status(204).send();
};
