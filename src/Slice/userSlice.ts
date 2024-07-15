import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  plan: string;
  websiteGenerationLimit: number;
}

const initialState: UserState = {
  username: "",
  plan: "Free",
  websiteGenerationLimit: 2, // Assuming the default limit for free plan
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setPlan: (state, action: PayloadAction<string>) => {
      state.plan = action.payload;
    },
    setWebsiteGenerationLimit: (state, action: PayloadAction<number>) => {
      state.websiteGenerationLimit = action.payload;
    },
    resetUserState: (state) => {
      state.username = "";
      state.plan = "Free";
      state.websiteGenerationLimit = 2;
    },
  },
});

export const {
  setUsername,
  setPlan,
  setWebsiteGenerationLimit,
  resetUserState,
} = userSlice.actions;

export default userSlice.reducer;
