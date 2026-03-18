"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const statusCode_1 = require("../constants/statusCode");
const messages_1 = require("../constants/messages");
class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getDonors(req, res, next) {
        try {
            const donors = await this.userService.getEligibleDonors();
            res.status(statusCode_1.StatusCode.OK).json({
                success: true,
                message: messages_1.SUCCESS_MESSAGES.FETCHED_SUCCESS,
                data: donors,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getProfile(req, res, next) {
        try {
            const userId = req.user.id;
            const user = await this.userService.getUserById(userId);
            res.status(statusCode_1.StatusCode.OK).json({
                success: true,
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async updateProfile(req, res, next) {
        try {
            const userId = req.user.id;
            await this.userService.updateUserProfile(userId, req.body);
            const updatedUser = await this.userService.getUserById(userId);
            res.status(statusCode_1.StatusCode.OK).json({
                success: true,
                message: messages_1.SUCCESS_MESSAGES.UPDATE_SUCCESS,
                data: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map