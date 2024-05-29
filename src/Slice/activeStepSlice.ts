import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Image {
  url: string;
  description: string;
}

interface Design {
  templateId: string;
  description: string;
}

interface UserDataState {
  businessName: string;
  description1: string;
  description2: string;
  images: Image[];
  designs: Design[];
  templateid: string;
  templatename: string;
  category: string | null;
}

const initialState: UserDataState = {
  businessName: "",
  description1: "",
  description2: "",
  images: [],
  designs: [],
  templateid: "",
  templatename: "",
  category: null,
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
    setTemplateId: (state, action: PayloadAction<string>) => {
      state.templateid = action.payload;
    },
    setTemplatename: (state, action: PayloadAction<string>) => {
      state.templatename = action.payload;
    },
    addDesign: (state, action: PayloadAction<Design>) => {
      state.designs.push(action.payload);
    },
    removeDesign: (state, action: PayloadAction<string>) => {
      state.designs = state.designs.filter(
        (design) => design.templateId !== action.payload
      );
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
      state.category = null; // Clear category along with other data
    },
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
  setCategory, // Export setCategory action
} = userDataSlice.actions;

export default userDataSlice.reducer;
