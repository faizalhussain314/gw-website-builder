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
