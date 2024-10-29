import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  plan: string;
  websiteGenerationLimit: number;
  gravator: string;
  email: string;
  generatedSite: number;
  max_genration: number;
}

const initialState: UserState = {
  username: "krishnapandian",
  plan: "Free",
  websiteGenerationLimit: 0,
  gravator:
    "https://www.gravatar.com/avatar/785b61c38ab6e8943260ae7d576b5957?s=80&d=identicon&r=g",
  email: "krishnapandian@wl.team",
  generatedSite: 2,
  max_genration: 6,
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
