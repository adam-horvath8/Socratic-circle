import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { essaysDataType, oneEssayType } from "@/types/types";

export const essaysDataSlice = createSlice({
  name: "essaysData",
  initialState: [] as essaysDataType,
  reducers: {
    addData: (state, action: PayloadAction<essaysDataType>) => {
      return action.payload;
    },
    updateData: (
      state,
      action: PayloadAction<{ id: string; likes: string[] }>
    ) => {
      const { id, likes } = action.payload;
      return state.map((essay) => {
        if (essay.id === id) {
          return { ...essay, likes };
        }
        return essay;
      });
    },
    removeData: (state, action: PayloadAction<string>) => {
      return state.filter((essay) => essay.id !== action.payload);
    },
  },
});

export const { addData, removeData, updateData } = essaysDataSlice.actions;

export default essaysDataSlice.reducer;
