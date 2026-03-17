import { IUserService } from "../interfaces/services-interface/user-service.interface";
import { IUserRepository } from "../interfaces/repository-interface/user-repository.interface";
import { IUser, UserDocument } from "../types/user";
import { cloudinaryService } from "./cloudinary.service";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getEligibleDonors(): Promise<UserDocument[]> {
    return this.userRepository.findAllEligible();
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findById(id);
  }

  async updateUserProfile(
    id: string,
    data: Partial<IUser> & { profileImage?: string }
  ): Promise<UserDocument | null> {
    const { profileImage, ...updateData } = data;

    if (profileImage) {
      // Find current user to get old publicId
      const currentUser = await this.userRepository.findById(id);
      
      // Upload new image
      const uploadResult = await cloudinaryService.uploadImage(profileImage);
      
      // Add photo details to update data
      updateData.photoUrl = uploadResult.url;
      updateData.photoPublicId = uploadResult.publicId;

      // Delete old image if it exists
      if (currentUser?.photoPublicId) {
        await cloudinaryService.deleteImage(currentUser.photoPublicId);
      }
    }

    return this.userRepository.updateUser(id, updateData);
  }
}
