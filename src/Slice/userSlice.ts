import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string;
  plan: string;
  websiteGenerationLimit: number;
  gravator: string;
  email: string;
  generatedSite: number;
  max_genration: number;
  wp_token: string;
  version: string | number | null;
}

const initialState: UserState = {
  username: "",
  plan: "",
  websiteGenerationLimit: 0,
  gravator: "",
  email: "",
  generatedSite: 2,
  max_genration: 6,
  wp_token: "",
  version: "2.0",
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
    setGravator: (state, action: PayloadAction<string>) => {
      state.gravator = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setGeneratedSite: (state, action: PayloadAction<number>) => {
      state.generatedSite = action.payload;
    },
    setMaxGeneration: (state, action: PayloadAction<number>) => {
      state.max_genration = action.payload;
    },
    setWpToken: (state, action: PayloadAction<string>) => {
      state.wp_token = action.payload;
    },
    setVersion: (state, action: PayloadAction<string>) => {
      state.version = action.payload;
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
  setGravator,
  setEmail,
  setGeneratedSite,
  setMaxGeneration,
  setWpToken,
  setVersion,
} = userSlice.actions;

export default userSlice.reducer;
