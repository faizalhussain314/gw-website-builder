import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { templatelist } from "../types/Preview.type"; // Assuming you have this type

interface Image {
  url: string;
  description: string;
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
  images: Image[];
  designs: Design[];
  templateid: number;
  templatename: string;
  category: string | null;
  content: string[];
  color: Color;
  font: string;
  templateList: templatelist[]; // Add this line
}

const initialState: UserDataState = {
  businessName: "",
  description1: "",
  description2: "",
  images: [],
  designs: [],
  templateid: 0,
  templatename: "",
  category: null,
  content: [],
  color: { primary: "", secondary: "" },
  font: "",
  templateList: [], // Add this line
};

export const userDataSlice = createSlice({
  name: "userData",
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
    addImage: (state, action: PayloadAction<Image>) => {
      state.images.push(action.payload);
    },
    removeImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((img) => img.url !== action.payload);
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
    setFont: (state, action: PayloadAction<string>) => {
      state.font = action.payload;
    },
    setColor: (state, action: PayloadAction<Color>) => {
      state.color = action.payload;
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
    setTemplateList: (state, action: PayloadAction<templatelist[]>) => {
      state.templateList = action.payload;
    }, // Add this action
  },
});

export const {
  setBusinessName,
  setDescriptionOne,
  setDescriptionTwo,
  addImage,
  removeImage,
  addDesign,
  removeDesign,
  clearUserData,
  setTemplatename,
  setTemplateId,
  setCategory,
  setContent,
  setFont,
  setColor,
  setTemplateList, // Export this action
} = userDataSlice.actions;

export default userDataSlice.reducer;
