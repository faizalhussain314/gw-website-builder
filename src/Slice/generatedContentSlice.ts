import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

interface GeneratedContent {
  variations: {
    [key: string]: {
      variation1: string;
    };
  };
  style: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
}

const initialState: GeneratedContent = {
  variations: {},
  style: {
    primaryColor: "",
    secondaryColor: "",
    fontFamily: "",
  },
};

const generatedContentSlice = createSlice({
  name: "generatedContent",
  initialState,
  reducers: {
    updateGeneratedContent: (
      state,
      action: PayloadAction<{ pageName: string; content: string }>
    ) => {
      const { pageName, content } = action.payload;
      state.variations[pageName] = {
        variation1: content,
      };
    },
  },
});

export const { updateGeneratedContent } = generatedContentSlice.actions;
export const selectGeneratedContent = (state: RootState) =>
  state.generatedContent;
export default generatedContentSlice.reducer;
