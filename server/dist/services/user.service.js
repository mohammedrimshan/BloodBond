"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
class UserService {
    constructor(userRepository, cloudinaryService) {
        this.userRepository = userRepository;
        this.cloudinaryService = cloudinaryService;
    }
    async getEligibleDonors() {
        return this.userRepository.findAllEligible();
    }
    async getUserById(id) {
        return this.userRepository.findById(id);
    }
    async updateUserProfile(id, data) {
        const { profileImage, ...updateData } = data;
        if (profileImage) {
            const currentUser = await this.userRepository.findById(id);
            const uploadResult = await this.cloudinaryService.uploadImage(profileImage);
            updateData.photoUrl = uploadResult.url;
            updateData.photoPublicId = uploadResult.publicId;
            if (currentUser?.photoPublicId) {
                await this.cloudinaryService.deleteImage(currentUser.photoPublicId);
            }
        }
        return this.userRepository.updateUser(id, updateData);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map