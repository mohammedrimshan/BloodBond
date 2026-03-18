"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
const messages_1 = require("../constants/messages");
const statusCode_1 = require("../constants/statusCode");
const jwt_service_1 = require("../services/jwt.service");
const verifyAuth = (req, res, next) => {
    try {
        const token = req.cookies["x-access-token"];
        if (!token) {
            res
                .status(statusCode_1.StatusCode.UNAUTHORIZED)
                .json({ message: messages_1.ERROR_MESSAGES.TOKEN_MISSING });
            return;
        }
        const decoded = (0, jwt_service_1.verifyAccessToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res
            .status(statusCode_1.StatusCode.UNAUTHORIZED)
            .json({ message: messages_1.ERROR_MESSAGES.TOKEN_EXPIRED });
    }
};
exports.verifyAuth = verifyAuth;
//# sourceMappingURL=auth.middleware.js.map