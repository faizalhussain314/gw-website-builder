// UserDetails.ts

// Interfaces for the nested template list data
export interface TemplatePage {
  title: string;
  slug: string;
  template_id: number;
  iframe_url: string;
  id: number;
}

export interface TemplateStyles {
  defaultFont: {
    primary: string;
    secondary: string;
  };
  defaultColor: {
    primary: string;
    secondary: string;
  };
  fonts: Array<{
    primary: string;
    secondary: string;
  }>;
  color: Array<{
    primary: string;
    secondary: string;
  }>;
}

export interface TemplateList {
  id: number;
  name: string;
  dark_theme: number;
  site_category_id: number;
  pages: TemplatePage[];
  is_premium: number;
  styles: TemplateStyles;
}

export interface UserDetails {
  businessName: string;
  category: string;
  color: string;
  contactform: string | null;
  content: string | null;
  description1: string;
  description2: string;
  designs: string | null;
  font: string;
  images: string | null;
  lastStep: string;
  logo: string;
  templateList: string;
  templateid: string;
  templatename: string;
}
