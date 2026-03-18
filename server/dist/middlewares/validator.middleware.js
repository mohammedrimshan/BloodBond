"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const statusCode_1 = require("../constants/statusCode");
const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const errors = result.error.errors.map((err) => ({
            field: err.path[0],
            message: err.message,
        }));
        res.status(statusCode_1.StatusCode.BAD_REQUEST).json({ success: false, message: errors });
        return;
    }
    req.body = result.data;
    next();
};
exports.validate = validate;
//# sourceMappingURL=validator.middleware.js.map