import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../Slice/activeStepSlice";
import userReducer from "../Slice/userSlice";
import generatedContentSlice from "../Slice/generatedContentSlice";
import usageReducer from "../Slice/usageSlice";

const store = configureStore({
  reducer: {
    userData: userDataReducer,
    user: userReducer,
    generatedContent: generatedContentSlice,
    usage: usageReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
