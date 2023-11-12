import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { essaysDataType } from "@/types/types";

export const essaysDataSlice = createSlice({
  name: "essaysData",
  initialState: [] as essaysDataType,
  reducers: {
    addData: (state, action: PayloadAction<essaysDataType>) => {
      return action.payload;
    },
    removeData: (state, action: PayloadAction<string>) => {
      return state.filter((essay) => essay.id !== action.payload);
    },
  },
});

export const { addData, removeData } = essaysDataSlice.actions;

export default essaysDataSlice.reducer;
