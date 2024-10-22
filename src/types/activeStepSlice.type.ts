export interface Page {
  name: string;
  status: string;
  slug: string;
  selected: boolean;
}

export interface ImageState {
  url: string;
  description: string;
}

export interface Design {
  templateId: string;
  description: string;
}

export interface Color {
  primary: string;
  secondary: string;
}

// export interface Font {
//   primaryFont: string;
//   secondaryFont: string;
// }

export interface Contactform {
  email: string | null;
  address: string | null;
  phoneNumber: string | null;
}

export interface UpdateContactFormPayload {
  email?: string;
  address?: string;
  phoneNumber?: string;
}

export interface page {
  id: number;
  title: string;
  iframe_url: string;
  slug: string;
  template_id: number;
}

export interface templateList {
  id: number;
  name: string;
  pages: page[];
  site_category_id: number;
}
export interface Font {
  primary: string;
  secondary: string;
}

export interface StyleState {
  defaultColor: Color;
  defaultFont: Font;
  color: Color[];
  fonts: Font[];
}

export interface UserDataState {
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
  font: Font;
  templateList: templateList;
  pages: Page[] | null;
  contactform: Contactform;
  isFormDetailsLoaded: boolean;
  lastStep: string;
  style: StyleState;
}
