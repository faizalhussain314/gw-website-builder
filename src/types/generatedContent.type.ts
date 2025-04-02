export type GeneratedContent = {
  template: string;
  pages: {
    [pageName: string]: {
      content: { [selector: string]: string };
    };
  };
  style: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
};

export type IframeContent = {
  content: string;
}[];

export interface PageContent {
  [index: number]: string;
}

export interface GeneratedPageState {
  spinner: boolean;
  [pageName: string]: PageContent | boolean;
}

export interface ApiPage {
  page_name: string;
  page_status: string;
  selected: string; // or a union like '0' | '1' if applicable
  page_slug: string;
}

export interface GeneratedPages {
  spinner: boolean;
  pages: { [pageName: string]: string[] };
}
