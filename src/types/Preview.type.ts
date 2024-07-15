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
