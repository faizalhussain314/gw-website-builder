// In ../../../types/design.type.ts
export interface TemplatePage {
  id: number;
  title: string;
  slug: string;
  template_id: number;
  iframe_url: string;
}

export interface FontPair {
  primary: string;
  secondary: string;
}

export interface ColorPair {
  primary: string;
  secondary: string;
}

export interface TemplateStyles {
  defaultFont: FontPair;
  defaultColor: ColorPair;
  fonts: FontPair[];
  color: ColorPair[];
}

export interface Template {
  id: number;
  name: string;
  dark_theme: boolean; // Note: boolean now!
  site_category_id: number;
  pages: TemplatePage[];
  is_premium: boolean;
  styles: TemplateStyles;
}
