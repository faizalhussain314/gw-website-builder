import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Page {
  name: string;
  status: string;
  slug: string;
  selected: boolean;
}

interface ImageState {
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
  images: ImageState[];
  designs: Design[];
  templateid: number;
  templatename: string;
  category: string | null;
  content: string[];
  logo: string;
  color: Color;
  font: string;
  templateList: any[];
  pages: Page[]; // Added 'pages' to state
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
  templateList: [],
  pages: [
    { name: "Home", status: "", slug: "homepage", selected: false },
    { name: "About Us", status: "", slug: "about", selected: false },
    { name: "Services", status: "", slug: "service", selected: false },
    { name: "Blog", status: "", slug: "blog", selected: false },
    { name: "Contact", status: "", slug: "contact", selected: false },
  ], // Default page structure
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
      state.templateList = action.payload;
    },
    setPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload; // Updating pages in Redux
    },
    updatePageStatus: (
      state,
      action: PayloadAction<{ name: string; status: string }>
    ) => {
      const page = state.pages.find(
        (page) => page.name === action.payload.name
      );
      if (page) {
        page.status = action.payload.status; // Updating status of specific page
      }
    },
    togglePageSelection: (state, action: PayloadAction<string>) => {
      const page = state.pages.find((page) => page.name === action.payload);
      if (page) {
        page.selected = !page.selected; // Toggling the selection of a page
      }
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
  setPages,
  updatePageStatus,
  togglePageSelection,
} = activeStepSlice.actions;

export default activeStepSlice.reducer;
