// types/customDesign.types.ts
export interface InitialDataFields {
  color?: string;
  font?: string;
  logo?: string;
}

export interface FormDetailsRequest {
  fields: string[];
}

export interface FormDetailsResponse {
  color?: string;
  font?: string;
  logo?: string;
  templateList?: string;
}

export interface ColorCombination {
  primary: string;
  secondary: string;
}

export interface FontCombination {
  primary: string;
  secondary: string;
}

export interface TemplatePageData {
  iframe_url: string;
  [key: string]: unknown;
}

export interface TemplateListData {
  pages?: TemplatePageData[];
  dark_theme?: boolean;
  [key: string]: unknown;
}

// Redux template list type (matching your actual Redux store structure)
export interface ReduxTemplateList {
  id: number;
  name: string;
  dark_theme: boolean; // Required, not optional
  pages: ReduxPage[]; // Proper typed array
  site_category_id: number;
}

export interface ReduxPage {
  id: number;
  title: string;
  iframe_url: string;
  slug: string;
  template_id: number;
}

// types/customizeSidebar.types.ts
export interface LogoWidthRequest {
  width: number;
}

export interface LogoWidthResponse {
  success: boolean;
  message?: string;
}

export interface StoreCustomizationRequest {
  color?: import("types/customdesign.type").SelectedColor;
  font?: import("types/activeStepSlice.type").Font;
  logo?: string;
}

export interface CustomizeSidebarFormDetailsResponse {
  color?: string;
  font?: string;
  logo?: string;
  templateList?: string;
  [key: string]: unknown;
}
