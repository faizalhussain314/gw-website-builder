// services/pageService.ts
import { wordpressAxios } from "@config";
import { Page } from "types/page.type";

export class PageService {
  async fetchGeneratedPageStatus(): Promise<Page[]> {
    try {
      const response = await wordpressAxios.post(
        "/wp-json/custom/v1/get-generated-page-status"
      );

      if (response.status === 200) {
        const { data } = response;
        if (data && Array.isArray(data)) {
          return data.map((page) => ({
            name: page.page_name,
            slug: page.page_slug,
            status: page.page_status,
            selected: page.selected === "1",
          }));
        }
      }
      return [];
    } catch (error) {
      console.error("Error fetching generated page status:", error);
      return [];
    }
  }

  async storeHtmlContent(
    pageName: string,
    htmlContent: string,
    templateName: string
  ): Promise<void> {
    try {
      await wordpressAxios.post("/wp-json/custom/v1/save-generated-html-data", {
        version_name: "5.5",
        page_name: pageName,
        template_name: templateName,
        html_data: JSON.stringify(htmlContent),
      });
    } catch (error) {
      console.error("Error storing HTML content:", error);
    }
  }

  async fetchAndStorePageData(
    pageName: string,
    templateName: string,
    versionName: string
  ): Promise<{ success: boolean; content?: string }> {
    try {
      if (!pageName || !templateName) {
        throw new Error("Page name or template name is not available");
      }

      const response = await wordpressAxios.post(
        "/wp-json/custom/v1/get-saved-html-data",
        {
          version_name: versionName,
          page_name: pageName,
          template_name: templateName,
        }
      );

      if (response.status === 200 && response.data?.data) {
        const rawHtmlContent = response.data.data[0]?.html_data;
        if (!rawHtmlContent) {
          throw new Error("HTML data is empty or undefined.");
        }

        const cleanedHtmlContent = rawHtmlContent
          .replace(/^"(.*)"$/, "$1")
          .replace(/\\"/g, '"')
          .replace(/\\n/g, "")
          .replace(/\\t/g, "")
          .replace(/\\\\/g, "");

        return { success: true, content: cleanedHtmlContent };
      }
      return { success: false };
    } catch (error) {
      console.error("Error storing page data:", error);
      return { success: false };
    }
  }

  async storeOldNewContent(
    pageName: string,
    jsonContent: Record<string, string>,
    wordCount: number,
    templateId: number,
    templateName: string
  ): Promise<void> {
    try {
      // Update count - this appears to be a Laravel/GravityWrite API call
      const updateResponse = await wordpressAxios.post(
        "wp-json/custom/v1/update-count",
        {
          words: wordCount,
          page_title: pageName,
          template_id: templateId,
          sitecount: 0,
          is_type: "words",
        }
      );

      if (updateResponse.status !== 200) {
        throw new Error("Failed to update word count");
      }

      // Save content - this is a WordPress API call
      await wordpressAxios.post("/wp-json/custom/v1/save-generated-data", {
        version_name: "5.5",
        page_name: pageName,
        template_name: templateName,
        json_content: jsonContent,
      });
    } catch (error) {
      console.error("Error storing old/new content:", error);
      throw error;
    }
  }
}
