import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string | null;
  name: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoUrl: string | null;
  isVerified: boolean;
  dateOfBirth?: string | null;
  bloodGroup?: string | null;
  place?: string | null;
  state?: string | null;
  lastDonatedDate?: string | null;
  whatsappNumber?: string | null;
  address?: string | null;
  pincode?: string | null;
  district?: string | null;
  isEligible?: boolean;
  location?: {
    type: string;
    coordinates: number[];
  } | null;
}

interface UserState {
  user: User;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: {
    id: null,
    name: null,
    email: null,
    phoneNumber: null,
    photoUrl: null,
    isVerified: false,
    dateOfBirth: null,
    bloodGroup: null,
    place: null,
    state: null,
    lastDonatedDate: null,
    whatsappNumber: null,
    address: null,
    pincode: null,
    district: null,
    isEligible: false,
    location: null,
  },
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    },
    clearUser: (state) => {
      state.user = initialState.user;
      state.isLoggedIn = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;