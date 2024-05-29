import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../Slice/activeStepSlice";

const store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
