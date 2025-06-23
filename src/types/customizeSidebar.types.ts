export interface LogoWidthRequest {
  width: number;
}

export interface LogoWidthResponse {
  success: boolean;
  message?: string;
}

export interface StoreCustomizationRequest {
  color?: import("./customdesign.type").SelectedColor;
  font?: import("./activeStepSlice.type").Font;
  logo?: string;
}

export interface CustomizeSidebarFormDetailsResponse {
  color?: string;
  font?: string;
  logo?: string;
  templateList?: string;
  [key: string]: unknown;
}
