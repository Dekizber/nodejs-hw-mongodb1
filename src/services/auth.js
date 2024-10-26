import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { randomBytes } from 'crypto';

import User from "../db/models/User.js";
import Session from "../db/models/Session.js";

import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";
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

    await Session.deleteOne({ userId: user._id });

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: Date.now() + accessTokenLifeTime,
        refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
    });
};
