import { IUserService } from "../interfaces/services-interface/user-service.interface";
import { IUserRepository } from "../interfaces/repository-interface/user-repository.interface";
import { UserDocument } from "../types/user";

export class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {}

  async getEligibleDonors(): Promise<UserDocument[]> {
    return this.userRepository.findAllEligible();
  }
}
