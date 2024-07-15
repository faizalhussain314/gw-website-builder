import { configureStore } from "@reduxjs/toolkit";
import userDataReducer from "../Slice/activeStepSlice";
import userReducer from "../Slice/userSlice";

const store = configureStore({
  reducer: {
    userData: userDataReducer,
    user: userReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
