import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

interface AdminState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
}

const initialState: AdminState = {
  admin: null,
  isAuthenticated: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin: (state, action: PayloadAction<AdminUser>) => {
      state.admin = action.payload;
      state.isAuthenticated = true;
    },
    clearAdmin: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAdmin, clearAdmin } = adminSlice.actions;
export default adminSlice.reducer;
