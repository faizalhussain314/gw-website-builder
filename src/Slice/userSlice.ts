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
  username: "",
  plan: "",
  websiteGenerationLimit: 0,
  gravator: "",
  email: "",
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
} = userSlice.actions;

export default userSlice.reducer;
