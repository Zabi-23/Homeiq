//api/utils/verifyUser.js

/* import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next) => {
    let token = req.cookies.access_token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(errorHandler(403, "You are not authenticated!"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, "Token is not valid!"));
        req.user = user;
        next();
    });
}; */

import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(errorHandler(403, "You are not authenticated!"));

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, "Token is not valid!"));
        req.user = user;
        next();
    });
};
