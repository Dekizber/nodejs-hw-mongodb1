import { Router } from "express";

import * as authControllers from "../controllers/auth.js";

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import { userLoginSchema, userRegisterSchema } from '../validation/users.js';

const authRouter = Router();

authRouter.post('/register', validateBody(userRegisterSchema), ctrlWrapper(authControllers.register));

authRouter.post('/login', validateBody(userLoginSchema), ctrlWrapper(authControllers.login));

export default authRouter;
