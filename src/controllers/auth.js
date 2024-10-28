import createHttpError from "http-errors";

import * as authServices from "../services/auth.js";

const setupSession = async (res, session) => {
    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
};

export const register = async (req, res) => {
    await authServices.register(req.body);

    res.status(201).json({
        status: 201,
        message: `Successfully registered a user!`,
    });
};

export const login = async (req, res) => {
    const session = await authServices.login(req.body);

    setupSession(res, session);

    res.json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const refreshSession = async (req, res) => {
    const session = await authServices.refreshSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });

    setupSession(res, session);

    res.json({
        status: 200,
        message: "Successfully refreshed a session!",
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const logout = async (req, res) => {
    if (!req.cookies.sessionId) {
        const { _id: userId } = req.user;
    };
