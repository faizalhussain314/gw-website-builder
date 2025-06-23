import { wordpressAxios } from "@config";
import { sendIframeMessage } from "../../../core/utils/sendIframeMessage.utils";
import {
  FormDetailsResponse,
  ColorCombination,
  FontCombination,
  TemplateListData,
} from "types/customDesign.types";

export class CustomDesignService {
  async fetchFormDetails(fields: string[]): Promise<FormDetailsResponse> {
    const response = await wordpressAxios.post<FormDetailsResponse>(
      "/wp-json/custom/v1/get-form-details",
      {
        fields,
      }
    );

    return response.data;
  }

  async fetchInitialData(businessName: string): Promise<void> {
    try {
      const result = await this.fetchFormDetails(["color", "font", "logo"]);

      if (result) {
        if (result.color) {
          const colors: ColorCombination = JSON.parse(result.color);
          sendIframeMessage("changeGlobalColors", colors);
        }

        if (result.font) {
          const font: FontCombination = JSON.parse(result.font);
          sendIframeMessage("changeFont", { font });
        }

        if (result.logo) {
          sendIframeMessage("changeLogo", { logoUrl: result.logo });
        } else {
          sendIframeMessage("bussinessName", businessName);
        }
        return;
      }

      sendIframeMessage("bussinessName", businessName);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      throw error;
    }
  }

  async fetchTemplateData(): Promise<TemplateListData | null> {
    try {
      const result = await this.fetchFormDetails(["templateList"]);

      if (result && result.templateList) {
        const parsedData: TemplateListData = JSON.parse(result.templateList);
        return parsedData;
      }

      return null;
    } catch (error) {
      console.error("Error fetching template data:", error);
      throw error;
    }
  }
}
