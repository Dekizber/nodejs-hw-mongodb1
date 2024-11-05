import { Router } from 'express';

import { isValidId } from '../middlewares/isValid.js';
import { parsePaginationParams } from '../middlewares/parsePaginationParams.js';
import { parseSortParamsDecorator } from '../utils/parseSortParamsDecorator.js';
import { authenticate } from '../middlewares/authenticete.js';
import { upload } from '../middlewares/multer.js';

import { sortByListContact } from '../db/models/Contact.js';

import * as contactController from '../controllers/contacts.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import { contactAddSchema, contactUpdateSchema } from '../validation/contacts.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', parsePaginationParams, parseSortParamsDecorator(sortByListContact), ctrlWrapper(contactController.getContacts));

contactRouter.get('/:contactId', isValidId, ctrlWrapper(contactController.getContactById));

contactRouter.post('/', upload.single('photo'), validateBody(contactAddSchema), ctrlWrapper(contactController.addContact));

// contactRouter.put('/:contactId', isValidId, validateBody(contactAddSchema), ctrlWrapper(contactController.upsertContact));

contactRouter.patch('/:contactId', upload.single('photo'), isValidId, validateBody(contactUpdateSchema), ctrlWrapper(contactController.patchContact));

contactRouter.delete('/:contactId', isValidId, ctrlWrapper(contactController.deleteContact));

export default contactRouter;
