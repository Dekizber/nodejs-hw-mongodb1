import { Router } from 'express';
import * as contactController from '../controllers/contacts.js';


const contactRouter = Router();

contactRouter.get('/', contactController.getContactsController);

contactRouter.get('/:contactId', contactController.getContactByIdController);

export default contactRouter;
