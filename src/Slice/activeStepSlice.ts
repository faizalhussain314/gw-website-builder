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
interface Contactform {
  email: string | null;
  address: string | null;
  phoneNumber: string | null;
}
interface UpdateContactFormPayload {
  email?: string;
  address?: string;
  phoneNumber?: string;
}

interface page {
  id: number;
  title: string;
  iframe_url: string;
  slug: string;
  template_id: number;
}
interface templateList {
  id: number;
  name: string;
  pages: page[];
  site_category_id: number;
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
  templateList: templateList;
  pages: Page[]; // Added 'pages' to state
  contactform: Contactform;
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
  templateList: {
    id: null,
    name: null,
    pages: [],
    site_category_id: null,
  },
  pages: [], // Default page structure
  contactform: {
    email: "",
    address: "",
    phoneNumber: "",
  },
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
    setTemplateList: (state, action: PayloadAction<templateList>) => {
      // Destructure the incoming payload to extract id, name, site_category_id, and pages
      const { id, name, site_category_id, pages } = action.payload;

      // Map the pages array to match the expected structure
      const mappedPages = pages.map((page) => ({
        id: page.id,
        title: page.title,
        iframe_url: page.iframe_url,
        slug: page.slug,
        template_id: page.template_id,
      }));

      // Update the state with the new template information
      state.templateList = {
        id,
        name,
        site_category_id,
        pages: mappedPages, // Store the mapped pages into the templateList
      };

      // Optionally, update the pages in the main state if you want to keep them in sync
      state.pages = mappedPages.map((page) => ({
        name: page.title,
        status: "", // Initially, set status as empty
        slug: page.slug,
        selected: false, // Initially not selected
      }));
    },

    setPages: (state, action: PayloadAction<Page[]>) => {
      state.pages = action.payload; // Updating pages in Redux
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
        page.status = action.payload.status; // Updating status
        if (action.payload.selected !== undefined) {
          page.selected = action.payload.selected; // Update selected if provided
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

      // Map the incoming templatePages array to match our Redux structure
      const mappedPages = templatePages.map((page: any) => ({
        name: page.title, // Use title as name
        status: "", // Initially no status
        slug: page.slug, // Use the slug from the template page
        selected: false, // Initially not selected
      }));

      // Combine Home page and mapped template pages
      state.pages = [...mappedPages];
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
  updateReduxPage,
  setPagesFromTemplate,
  togglePageSelection,
  updateContactForm,
} = activeStepSlice.actions;

export default activeStepSlice.reducer;
