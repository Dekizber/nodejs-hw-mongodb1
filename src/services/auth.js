import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';
import * as path from "node:path";
import { readFile } from "fs/promises";
import handlebars from "handlebars";
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';


import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';

import User from "../db/models/User.js";
import Session from "../db/models/Session.js";

import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";
import { TEMPLATES_DIR } from "../constants/index.js";

const createSession = async (user) => {

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    const accessTokenValidUntil = Date.now() + accessTokenLifeTime;
    const refreshTokenValidUntil = Date.now() + refreshTokenLifeTime;

    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    };
};

export const register = async (payload) => {
    const { email, password } = payload;
    const user = await User.findOne({ email });
    if (user) {
        throw createHttpError(409, "Email already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return await User.create({ ...payload, password: hashPassword });

    // const verifyEmailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');
    // const templateSource = await readFile(verifyEmailTemplatePath, 'utf-8');
    // const template = handlebars.compile(templateSource);
    // const appDomain = env('APP_DOMAIN');

    // const html = template({
    //     username: newUser.username,
    //     link: `${appDomain}/auth/verify?token=`
    // });

    // const verifyEmail = {
    //     to: email,
    //     subject: 'Підтвердження email',
    //     html,
    // };

    // await sendEmail(verifyEmail);

    // return newUser;
};




export const login = async (payload) => {
    const { email, password } = payload;
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Invalid email or password");
    }

    // if (!user.verify) {
    //     throw createHttpError(401, "Email is not verified");
    // }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, "Invalid email or password");
    };

    // Delete any existing sessions for the user
    await Session.deleteMany({ userId: user._id });

    const newSession = await createSession();
    const session = await Session.create({
        userId: user._id,
        ...newSession,
    });

    console.log('Session created:', session);

    return session;


};

export const refreshSession = async ({ sessionId, refreshToken }) => {
    const oldSession = await Session.findOne({
        _id: sessionId,
        refreshToken: refreshToken,
    });

    if (!oldSession) {
        throw createHttpError(401, "Session not found");
    }

    if (Date.now() > oldSession.refreshTokenValidUntil) {
        throw createHttpError(401, "Refresh token expired");
    }

    const newSession = await createSession();
    oldSession.accessToken = newSession.accessToken;
    oldSession.refreshToken = newSession.refreshToken;
    oldSession.accessTokenValidUntil = newSession.accessTokenValidUntil;
    oldSession.refreshTokenValidUntil = newSession.refreshTokenValidUntil;

    await oldSession.save();

    return oldSession;
};

export const logout = async (sessionId) => {
    await Session.deleteOne({ _id: sessionId });
};

export const findSession = filter => Session.findOne(filter);

export const findUser = filter => User.findOne(filter);

export const requestResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }
    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        env('JWT_SECRET'),
        {
            expiresIn: '5m',
        },
    );

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html',
    );

    const templateSource = (
        await fs.readFile(resetPasswordTemplatePath)
    ).toString();

    const template = handlebars.compile(templateSource);
    const html = template({
        name: user.name,
        link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
    });

    await sendEmail({
        from: env(SMTP.SMTP_FROM),
        to: email,
        subject: 'Reset your password',
        html,
    });
};

export const resetPassword = async (payload) => {
    let entries;

    try {
        entries = jwt.verify(payload.token, env('JWT_SECRET'));
    } catch (err) {
        if (err instanceof Error) throw createHttpError(401, err.message);
        throw err;
    }

    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await User.updateOne(
        { _id: user._id },
        { password: encryptedPassword },
    );
};
