"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.log(err);
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map