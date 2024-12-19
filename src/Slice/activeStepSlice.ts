import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UserDataState,
  Page,
  Design,
  Color,
  Font,
  UpdateContactFormPayload,
  templateList,
  StyleState,
} from "../types/activeStepSlice.type";

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
  font: { primary: "", secondary: "" },
  templateList: {
    id: null,
    name: null,
    dark_theme: null,
    pages: [],
    site_category_id: null,
  },
  pages: [],
  contactform: {
    email: "",
    address: "",
    phoneNumber: "",
  },
  isFormDetailsLoaded: false,
  lastStep: "",
  style: {
    defaultColor: { primary: "", secondary: "" },
    defaultFont: { primary: "", secondary: "" },
    color: [],
    fonts: [],
  },
  logoWidth: 150,
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
    setWidth: (state, action: PayloadAction<number>) => {
      state.logoWidth = action.payload;
    },
    setFont: (state, action: PayloadAction<Color>) => {
      state.font.primary = action.payload.primary;
      state.font.secondary = action.payload.secondary;
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
      state.templateid = 0;
      state.templatename = "";
      state.logo = "";
      state.category = null;
      state.content = [];
      state.color = { primary: "", secondary: "" };
      state.font = { primary: "", secondary: "" };
      state.templateList = {
        id: null,
        name: null,
        dark_theme: null,
        pages: [],
        site_category_id: null,
      };
      state.pages = [];
      state.contactform = { email: "", phoneNumber: "", address: "" };
      state.isFormDetailsLoaded = false;
      state.lastStep = "";
      state.style = {
        defaultColor: { primary: "", secondary: "" },
        defaultFont: { primary: "", secondary: "" },
        color: [],
        fonts: [],
      };
    },

    setTemplateList: (state, action: PayloadAction<templateList>) => {
      const { id, name, site_category_id, pages, dark_theme } = action.payload;

      const mappedPages = pages.map((page) => ({
        id: page.id,
        title: page.title,
        iframe_url: page.iframe_url,
        slug: page.slug,
        template_id: page.template_id,
      }));

      state.pages = mappedPages.map((page) => ({
        name: page.title,
        status: "",
        slug: page.slug,
        selected: page.title === "Home" ? true : false,
      }));

      state.templateList = {
        id,
        name,
        site_category_id,
        pages: mappedPages,
        dark_theme: dark_theme,
      };

      state.pages = mappedPages.map((page) => ({
        name: page.title,
        status: "",
        slug: page.slug,
        selected: false,
      }));
    },

    setPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload;
    },
    updateContactForm: (
      state,
      action: PayloadAction<UpdateContactFormPayload>
    ) => {
      const { email, address, phoneNumber } = action.payload;
      if (email !== undefined) {
        state.contactform.email = email;
      }
      if (address !== undefined) {
        state.contactform.address = address;
      }
      if (phoneNumber !== undefined) {
        state.contactform.phoneNumber = phoneNumber;
      }
    },
    updateReduxPage: (
      state,
      action: PayloadAction<{
        name: string;
        status: string;
        selected?: boolean;
      }>
    ) => {
      const page = state.pages.find(
        (page) => page.name === action.payload.name
      );

      if (page) {
        page.status = action.payload.status;

        if (action.payload.selected !== undefined) {
          if (page.name === "Home") {
            page.selected = true;
          } else {
            page.selected = action.payload.selected;
          }
        }
      }
    },

    setPagesFromTemplate: (state, action: PayloadAction<Page[]>) => {
      const templatePages = action.payload;

      // Create the mandatory Home page
      // const homePage = {
      //   name: "Home",
      //   status: "", // Initially no status
      //   slug: "home",
      //   selected: false, // Initially not selected
      // };

      const mappedPages = templatePages.map((page: any) => ({
        name: page.title,
        status: "",
        slug: page.slug,
        selected: false,
      }));

      state.pages = [...mappedPages];
    },

    togglePageSelection: (state, action: PayloadAction<string>) => {
      const page = state.pages.find((page) => page.name === action.payload);

      if (page) {
        if (page?.name === "Home") {
          page.selected = true;
        } else {
          page.selected = !page.selected;
        }
      }

      if (page) {
        page.selected = !page.selected;
      }
    },
    setFormDetailsLoaded: (state, action: PayloadAction<boolean>) => {
      state.isFormDetailsLoaded = action.payload;
    },
    setlastStep: (state, action: PayloadAction<string>) => {
      state.lastStep = action.payload;
    },
    setStyle: (state, action: PayloadAction<any>) => {
      state.style = action.payload;
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
  updateReduxPage,
  setPagesFromTemplate,
  togglePageSelection,
  updateContactForm,
  setFormDetailsLoaded,
  setlastStep,
  setStyle,
  setWidth,
} = activeStepSlice.actions;

export default activeStepSlice.reducer;
