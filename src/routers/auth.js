import { Router } from "express";

import * as authControllers from "../controllers/auth.js";

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import { requestResetEmailSchema, resetPasswordSchema, userLoginSchema, userRegisterSchema } from '../validation/users.js';

const authRouter = Router();

authRouter.post('/register', validateBody(userRegisterSchema), ctrlWrapper(authControllers.register));

authRouter.post('/login', validateBody(userLoginSchema), ctrlWrapper(authControllers.login));

authRouter.post('/refresh', ctrlWrapper(authControllers.refreshSession));

authRouter.post('/logout', ctrlWrapper(authControllers.logout));

authRouter.post('/send-reset-email', validateBody(requestResetEmailSchema), ctrlWrapper(authControllers.requestResetEmailController));

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(authControllers.resetPasswordController));

export default authRouter;
