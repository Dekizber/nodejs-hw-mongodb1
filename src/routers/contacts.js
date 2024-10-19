import { Router } from 'express';
import { isValidId } from '../middlewares/isValid.js';
import * as contactController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';


const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(contactController.getContacts));

contactRouter.get('/:contactId', isValidId, ctrlWrapper(contactController.getContactById));

contactRouter.post('/', ctrlWrapper(contactController.addContact));

// contactRouter.put('/:contactId', isValidId, ctrlWrapper(contactController.upsertContact));

contactRouter.patch('/:contactId', isValidId, ctrlWrapper(contactController.patchContact));

contactRouter.delete('/:contactId', isValidId, ctrlWrapper(contactController.deleteContact));

export default contactRouter;
