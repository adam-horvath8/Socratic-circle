import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const essaysDataSlice = createSlice({
  name: "essaysData",
  initialState: [],
  reducers: {
    addData: (state, action) => {
      return action.payload;
    },
  },
});

export const { addData } = essaysDataSlice.actions;

export default essaysDataSlice.reducer;