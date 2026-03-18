"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
function userRoutes(userController) {
    const router = (0, express_1.Router)();
    router.get("/donors", (0, express_async_handler_1.default)(userController.getDonors.bind(userController)));
    router.get("/profile", auth_middleware_1.verifyAuth, (0, express_async_handler_1.default)(userController.getProfile.bind(userController)));
    router.put("/profile", auth_middleware_1.verifyAuth, (0, express_async_handler_1.default)(userController.updateProfile.bind(userController)));
    return router;
}
//# sourceMappingURL=user.route.js.map