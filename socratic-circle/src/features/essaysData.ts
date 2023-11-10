import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { essaysDataType } from "@/types/types";

export const essaysDataSlice = createSlice({
  name: "essaysData",
  initialState: [] as essaysDataType,
  reducers: {
    addData: (state, action: PayloadAction<essaysDataType>) => {
      return action.payload;
    },
  },
});

export const { addData } = essaysDataSlice.actions;

export default essaysDataSlice.reducer;
