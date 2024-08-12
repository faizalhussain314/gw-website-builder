import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../Slice/activeStepSlice";
import userReducer from "../Slice/userSlice";
import generatedContentSlice from "../Slice/generatedContentSlice";

const store = configureStore({
  reducer: {
    userData: userDataReducer,
    user: userReducer,
    generatedContent: generatedContentSlice,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
