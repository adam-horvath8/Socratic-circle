import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "authState",
  initialState: false,
  reducers: {
    login: (state, action: PayloadAction<boolean>) => {
      return action.payload;
    },
  },
});

export const { login } = authSlice.actions;

export default authSlice.reducer;
