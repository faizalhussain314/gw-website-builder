import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Template } from "../types/Preview.type"; // Using the updated type

interface ImageState {
  images: { url: string; description: string }[];
}

interface Design {
  templateId: string;
  description: string;
}

interface Color {
  primary: string;
  secondary: string;
}

interface UserDataState {
  businessName: string;
  description1: string;
  description2: string;
  images: ImageState[];
  designs: Design[];
  templateid: number;
  templatename: string;
  category: string | null;
  content: string[];
  logo: string;
  color: Color;
  font: string;
  templateList: any;
}

const initialState: UserDataState = {
  businessName: "",
  description1: "",
  description2: "",
  images: [],
  designs: [],
  templateid: 0,
  templatename: "",
  logo: "",
  category: null,
  content: [],
  color: { primary: "", secondary: "" },
  font: "",
  templateList: [], // Initialize as an empty array of Template
};

export const activeStepSlice = createSlice({
  name: "activeStep",
  initialState,
  reducers: {
    setBusinessName: (state, action: PayloadAction<string>) => {
      state.businessName = action.payload;
    },
    setDescriptionOne: (state, action: PayloadAction<string>) => {
      state.description1 = action.payload;
    },
    setDescriptionTwo: (state, action: PayloadAction<string>) => {
      state.description2 = action.payload;
    },
    setTemplateId: (state, action: PayloadAction<number>) => {
      state.templateid = action.payload;
    },
    setTemplatename: (state, action: PayloadAction<string>) => {
      state.templatename = action.payload;
    },
    setContent: (state, action: PayloadAction<string[]>) => {
      state.content = action.payload;
    },
    addDesign: (state, action: PayloadAction<Design>) => {
      state.designs.push(action.payload);
    },
    removeDesign: (state, action: PayloadAction<string>) => {
      state.designs = state.designs.filter(
        (design) => design.templateId !== action.payload
      );
    },
    setLogo: (state, action: PayloadAction<string>) => {
      state.logo = action.payload;
    },
    setFont: (state, action: PayloadAction<string>) => {
      state.font = action.payload;
    },
    setColor: (state, action: PayloadAction<Color>) => {
      state.color.primary = action.payload.primary;
      state.color.secondary = action.payload.secondary;
    },
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.category = action.payload;
    },
    clearUserData: (state) => {
      state.businessName = "";
      state.description1 = "";
      state.description2 = "";
      state.images = [];
      state.designs = [];
      state.category = null;
      state.content = [];
      state.color = { primary: "", secondary: "" };
      state.font = "";
    },
    setTemplateList: (state, action: PayloadAction<any>) => {
      // Assigning the correct template list structure
      state.templateList = action.payload;
    },
  },
});

export const {
  setBusinessName,
  setDescriptionOne,
  setDescriptionTwo,
  addDesign,
  removeDesign,
  clearUserData,
  setTemplatename,
  setTemplateId,
  setLogo,
  setCategory,
  setContent,
  setFont,
  setColor,
  setTemplateList,
} = activeStepSlice.actions;

export default activeStepSlice.reducer;
