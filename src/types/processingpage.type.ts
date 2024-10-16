export interface ApiPage {
  id: number;
  title: string;
  slug: string;
  template_id: number;
  xml_url: string;
}

export interface ReduxPage {
  name: string;
  status: string;
  slug: string;
  selected: boolean;
}

export interface Plugin {
  id: number;
  name: string;
  slug: string;
}

export interface TemplateImportUrl {
  id: number;
  name: string;
  url: string;
}

export interface TemplateData {
  plugins: Plugin[];
  pages: ApiPage[];
  template_import_urls: TemplateImportUrl[];
  sitelogo?: "string";
}

export interface ApiStep {
  name: string;
  endpoint: string;
  body: object;
}

// Utility function to map API response to Redux-compatible format
export const mapApiPageToReduxPage = (apiPage: ApiPage): ReduxPage => ({
  name: apiPage.title,
  status: "Pending",
  slug: apiPage.slug,
  selected: false,
});
