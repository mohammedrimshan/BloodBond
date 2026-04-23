import { IUserService } from "../interfaces/services-interface/user-service.interface";
import { IUserRepository } from "../interfaces/repository-interface/user-repository.interface";
import { ICloudinaryService } from "../interfaces/services-interface/cloudinary-service.interface";
import { IUser, UserDocument } from "../types/user";

export class UserService implements IUserService {
  constructor(
    private userRepository: IUserRepository,
    private cloudinaryService: ICloudinaryService
  ) {}

  async getEligibleDonors(): Promise<any[]> {
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

  async getNearbyDonors(lat: number, lng: number, radius: number): Promise<any[]> {
    return this.userRepository.findNearbyDonors(lat, lng, radius);
  }

  async getPublicProfile(id: string): Promise<any> {
    return this.userRepository.getPublicProfile(id);
  }
}
