import { wordpressAxios } from "@config";
import { SelectedColor } from "types/customdesign.type";
import { Font } from "types/activeStepSlice.type";

export interface LogoWidthRequest {
  width: number;
}

export interface LogoWidthResponse {
  success: boolean;
  message?: string;
}

export interface StoreCustomizationRequest {
  color?: SelectedColor;
  font?: Font;
  logo?: string;
}

export interface FormDetailsResponse {
  color?: string;
  font?: string;
  logo?: string;
  templateList?: string;
  [key: string]: unknown;
}

export class CustomizeSidebarService {
  async setLogoWidth(width: number): Promise<LogoWidthResponse> {
    const response = await wordpressAxios.post<LogoWidthResponse>(
      "/wp-json/custom/v1/set-logo-width",
      { width }
    );
    return response.data;
  }

  async getFormDetails(fields: string[]): Promise<FormDetailsResponse> {
    const response = await wordpressAxios.post<FormDetailsResponse>(
      "/wp-json/custom/v1/get-form-details",
      { fields }
    );
    return response.data;
  }

  // async storeCustomizationData(data: StoreCustomizationRequest): Promise<void> {
  // This would be implemented based on your storeContent hook logic
  // Since storeContent is a custom hook, we'll keep it in the component
  // but you can extract the API calls here if needed
  // }
}
