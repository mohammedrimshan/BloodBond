import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CloudinaryService {
  /**
   * Upload an image to cloudinary.
   * @param file The file as a Base64 string or file path.
   * @param folder Optional folder name.
   */
  async uploadImage(file: string, folder: string = "blood-bond/profiles"): Promise<{ url: string; publicId: string }> {
    try {
      const result = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: "auto",
      });
      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  }

  /**
   * Delete an image from cloudinary.
   * @param publicId The public ID of the image to delete.
   */
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      // We don't necessarily want to throw here to avoid blocking the main flow
    }
  }
}

export const cloudinaryService = new CloudinaryService();
