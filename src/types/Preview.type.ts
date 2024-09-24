/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Website {
  link: string;
  option: string;
  templateid: number;
  templatename: string;
}

// export interface templatelist {
//   link: string;
//   templateid: number;
//   templatename: string;
//   templatepages: {
//     home: string;
//     about: string;
//     services: string;
//     blog: string;
//     contact: string;
//   };
// }

// interface Page {
//   title: string;
//   slug: string;
//   template_id: number;
//   iframe_url: string;
//   id: number;
// }

interface Site {
  id: number;
  name: string;
  site_category_id: number;
  pages: Page[];
}

export type templatelist = Site[];

export interface selectedTem {
  link: string;
  templateid: number;
  templatename: string;
  templatepages: {
    link: string;
    templateid: number;
    templatename: string;
    templatepages: { unknown: any };
  };
}

export interface Page {
  title: string;
  slug: string;
  template_id: number;
  iframe_url: string;
  id: number;
}

export interface Template {
  id: number;
  name: string;
  site_category_id: number;
  pages: Page[];
}

export interface TemplateListResponse {
  data: Template[];
  message: string;
  code: number;
  response: string;
}
