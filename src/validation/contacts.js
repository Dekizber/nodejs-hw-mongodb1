import Joi from 'joi';
import { typeList } from '../constants/contacts.js';

export const contactAddSchema = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.number().required(),
    email: Joi.string(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...typeList),
});
