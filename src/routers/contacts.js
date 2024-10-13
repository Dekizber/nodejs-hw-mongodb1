import { Router } from 'express';
import { isValidId } from '../middlewares/isValid.js';
import * as contactController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';


const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(contactController.getContactsController));

contactRouter.get('/:contactId', isValidId, ctrlWrapper(contactController.getContactByIdController));

contactRouter.post('/', ctrlWrapper(contactController.addContactController));

// contactRouter.put('/:contactId', ctrlWrapper(contactController.upsertContactController));

contactRouter.patch('/:contactId', ctrlWrapper(contactController.patchContactController));

contactRouter.delete('/:contactId', ctrlWrapper(contactController.deleteContactController));

export default contactRouter;
