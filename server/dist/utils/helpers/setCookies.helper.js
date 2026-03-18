"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookies = void 0;
const setCookies = (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("x-access-token", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
    });
    res.cookie("x-refresh-token", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: "lax",
    });
};
exports.setCookies = setCookies;
//# sourceMappingURL=setCookies.helper.js.map