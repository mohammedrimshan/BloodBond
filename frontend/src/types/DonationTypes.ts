import type { User } from "./UserTypes";

export interface IDonation {
  _id: string;
  userId: string | Partial<User>;
  donatedAt: string;
  nextEligibleDate: string;
  isEmergency?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedDonations {
  success: boolean;
  donations: IDonation[];
  total: number;
  page: number;
  totalPages: number;
}
