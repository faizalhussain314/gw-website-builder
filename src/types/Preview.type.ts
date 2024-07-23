/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Website {
  link: string;
  option: string;
  templateid: number;
  templatename: string;
}

export interface templatelist {
  link: string;
  templateid: number;
  templatename: string;
  templatepages: {
    home: string;
    about: string;
    services: string;
    blog: string;
    contact: string;
  };
}

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
