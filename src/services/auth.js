import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';

import User from "../db/models/User.js";
import Session from "../db/models/Session.js";

import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";
import exp from "constants";

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
};

export const login = async (payload) => {
    const { email, password } = payload;
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Invalid email or password");
    }

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
