import { UserDocument } from "../../types/user";

export interface IUserService {
  getEligibleDonors(): Promise<UserDocument[]>;
}
