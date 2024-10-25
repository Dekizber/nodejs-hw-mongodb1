import { Router } from 'express';

import { isValidId } from '../middlewares/isValid.js';
import { parsePaginationParams } from '../middlewares/parsePaginationParams.js';
import { parseSortParamsDecorator } from '../utils/parseSortParamsDecorator.js';

import { sortByListContact } from '../db/models/Contact.js';

import * as contactController from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import { contactAddSchema, contactUpdateSchema } from '../validation/contacts.js';

const contactRouter = Router();

contactRouter.get('/', parsePaginationParams, parseSortParamsDecorator(sortByListContact), ctrlWrapper(contactController.getContacts));

contactRouter.get('/:contactId', isValidId, ctrlWrapper(contactController.getContactById));

contactRouter.post('/', validateBody(contactAddSchema), ctrlWrapper(contactController.addContact));

// contactRouter.put('/:contactId', isValidId, validateBody(contactAddSchema), ctrlWrapper(contactController.upsertContact));

contactRouter.patch('/:contactId', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactController.patchContact));

contactRouter.delete('/:contactId', isValidId, ctrlWrapper(contactController.deleteContact));

export default contactRouter;
