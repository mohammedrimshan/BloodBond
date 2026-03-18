"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
class CloudinaryService {
    /**
     * Upload an image to cloudinary.
     * @param file The file as a Base64 string or file path.
     * @param folder Optional folder name.
     */
    async uploadImage(file, folder = "blood-bond/profiles") {
        try {
            const result = await cloudinary_1.v2.uploader.upload(file, {
                folder,
                resource_type: "auto",
            });
            return {
                url: result.secure_url,
                publicId: result.public_id,
            };
        }
        catch (error) {
            console.error("Cloudinary upload error:", error);
            throw new Error("Failed to upload image to Cloudinary");
        }
    }
    /**
     * Delete an image from cloudinary.
     * @param publicId The public ID of the image to delete.
     */
    async deleteImage(publicId) {
        try {
            await cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            console.error("Cloudinary delete error:", error);
            // We don't necessarily want to throw here to avoid blocking the main flow
        }
    }
}
exports.CloudinaryService = CloudinaryService;
//# sourceMappingURL=cloudinary.service.js.map