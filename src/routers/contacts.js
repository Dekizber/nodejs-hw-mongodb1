import { Router } from 'express';
import { isValidId } from '../middlewares/isValid.js';
import * as contactController from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';


const contactRouter = Router();

contactRouter.get('/', ctrlWrapper(contactController.getContactsController));

contactRouter.get('/:contactId', isValidId, ctrlWrapper(contactController.getContactByIdController));

export default contactRouter;
