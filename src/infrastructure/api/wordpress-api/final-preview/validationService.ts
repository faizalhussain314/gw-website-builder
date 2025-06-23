// services/validationService.ts
import { wordpressAxios } from "@config";

export class ValidationService {
  async checkWordCount(): Promise<{
    success: boolean;
    status: string | boolean;
  }> {
    try {
      // This appears to be a Laravel/GravityWrite API call based on the endpoint pattern
      const response = await wordpressAxios.get(
        "wp-json/custom/v1/check-word-count"
      );
      return {
        success: true,
        status: response.data.status,
      };
    } catch (error) {
      console.error("Error checking word count:", error);
      return { success: false, status: false };
    }
  }

  async checkSiteCount(): Promise<{
    success: boolean;
    status: string | boolean;
  }> {
    try {
      // This appears to be a Laravel/GravityWrite API call based on the endpoint pattern
      const response = await wordpressAxios.get(
        "/wp-json/custom/v1/check-site-count"
      );
      return {
        success: true,
        status: response.data.status,
      };
    } catch (error) {
      console.error("Error checking site count:", error);
      return { success: false, status: false };
    }
  }

  async checkPreviousImport(): Promise<boolean> {
    try {
      const response = await wordpressAxios.post(
        "/wp-json/custom/v1/check-previous-import",
        {
          value: true,
        }
      );
      return response.data.value === true;
    } catch (error) {
      console.error("Error checking previous import:", error);
      return false;
    }
  }

  async checkImageCount(
    selectedPage: string | null,
    templateId: number
  ): Promise<boolean> {
    try {
      // This appears to be a Laravel/GravityWrite API call
      const response = await wordpressAxios.post(
        "wp-json/custom/v1/check-image-count",
        {
          page_name: selectedPage,
          template_id: templateId,
        }
      );
      return response.data.status === true;
    } catch (error) {
      console.error("Error checking image count:", error);
      return false;
    }
  }
}
