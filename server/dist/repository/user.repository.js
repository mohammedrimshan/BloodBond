"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const base_respository_1 = require("./base.respository");
const user_model_1 = require("../models/user.model");
class UserRepository extends base_respository_1.BaseRepository {
    constructor() {
        super(user_model_1.UserModel);
    }
    async findByEmail(email) {
        return this.model.findOne({ email }).exec();
    }
    async findAllEligible() {
        return this.model.find({}).exec();
    }
    async updateUser(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map