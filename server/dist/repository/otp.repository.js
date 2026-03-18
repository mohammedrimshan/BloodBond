"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpRepository = void 0;
const base_respository_1 = require("./base.respository");
const otp_model_1 = require("../models/otp.model");
class OtpRepository extends base_respository_1.BaseRepository {
    constructor() {
        super(otp_model_1.OTPModel);
    }
    async findByUserIdAndOtp(userId, otp) {
        return this.model.findOne({ userId, otp }).exec();
    }
    async deleteManyByUserId(userId) {
        await this.model.deleteMany({ userId }).exec();
    }
}
exports.OtpRepository = OtpRepository;
//# sourceMappingURL=otp.repository.js.map