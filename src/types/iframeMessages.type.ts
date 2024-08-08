export interface BaseMessage {
  type: string;
}

export interface ChangeLogoMessage extends BaseMessage {
  type: "changeLogo";
  logoUrl: string;
}

export interface ScrollMessage extends BaseMessage {
  type: "scroll";
  scrollAmount: number;
}

export interface StopScrollingMessage extends BaseMessage {
  type: "stopScrolling";
  scrollAmount: number;
}

export interface StartMessage extends BaseMessage {
  type: "start";
  templateName: string;
  pageName: string;
  description?: string;
}

export interface SaveContentMessage extends BaseMessage {
  type: "saveContent";
}

export interface RegenerateMessage extends BaseMessage {
  type: "regenerate";
  templateName: string;
  pageName: string;
}

export interface ChangeFontMessage extends BaseMessage {
  type: "changeFont";
  font: string;
}

export interface ChangeGlobalColorsMessage extends BaseMessage {
  type: "changeGlobalColors";
  primaryColor: string;
  secondaryColor: string;
}

export type IframeMessage =
  | ChangeLogoMessage
  | ScrollMessage
  | StopScrollingMessage
  | StartMessage
  | SaveContentMessage
  | RegenerateMessage
  | ChangeFontMessage
  | ChangeGlobalColorsMessage;
