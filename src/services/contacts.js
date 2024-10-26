import ContactCollection from '../db/models/Contact.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({ page, perPage: limit, sortBy = '_id', sortOrder = 'asc' }) => {
    const skip = (page - 1) * limit;
    const data = await ContactCollection.find().skip(skip).limit(limit).sort({ [sortBy]: sortOrder });
    const totalItems = await ContactCollection.find().countDocuments();

    const paginationData = calcPaginationData({ totalItems, page, perPage: limit });

    return {
        page,
        perPage: limit,
        ...paginationData,
        data,
        totalItems,

    };
};

export const getContactById = id => ContactCollection.findById(id);

export const addContact = payload => ContactCollection.create(payload);

export const updateContactById = async (_id, payload, options = {}) => {
    const result = await ContactCollection.findOneAndUpdate({ _id }, payload, {
        includeResultMetadata: true,
        ...options,
    });

    if (!result || !result.value) return null;

    return {
        data: result.value,
        isNew: Boolean(result.lastErrorObject.upserted),

    };
};

export const deleteContactById = _id => ContactCollection.findOneAndDelete({ _id });
