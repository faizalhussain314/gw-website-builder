import { wordpressAxios } from "@config";
import { Page } from "types/page.type";

export class ImportService {
  async deleteThemeAndPlugins(): Promise<void> {
    await wordpressAxios.delete("/wp-json/custom/v1/delete-theme-and-plugins");
  }

  async deleteAllPosts(): Promise<void> {
    await wordpressAxios.delete("/wp-json/custom/v1/delete-all-posts");
  }

  async saveGeneratedImage(
    pageName: string,
    templateName: string,
    imageMapping: Record<string, string>
  ): Promise<void> {
    try {
      await wordpressAxios.post("/wp-json/custom/v1/save-generated-image", {
        version_name: "5.5",
        page_name: pageName,
        template_name: templateName,
        json_content: imageMapping,
      });
    } catch (error) {
      console.error("Error saving image data:", error);
      throw error;
    }
  }

  async deleteStyle(): Promise<void> {
    await wordpressAxios.delete("/wp-json/custom/v1/delete-all-styles");
  }

  async deletePage(): Promise<boolean> {
    try {
      await wordpressAxios.delete(
        "/wp-json/custom/v1/remove-all-generated-data"
      );
      return true;
    } catch (error) {
      console.error("Failed to delete pages:", error);
      return false;
    }
  }

  async savePagesToDB(pages: Page[], findIndex?: number): Promise<void> {
    try {
      await wordpressAxios.post(
        "/wp-json/custom/v1/save-generated-page-status",
        {
          pages,
          currentIndex: findIndex,
        }
      );
    } catch (error) {
      console.error("Failed to store pages:", error);
      throw error;
    }
  }
}
