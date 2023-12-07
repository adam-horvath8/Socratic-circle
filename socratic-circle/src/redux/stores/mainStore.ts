import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth";
import essaysReducer from "../features/essaysData";

const store = configureStore({
  reducer: {
    authState: authReducer,
    essaysData: essaysReducer,
  },
});

export default store;
