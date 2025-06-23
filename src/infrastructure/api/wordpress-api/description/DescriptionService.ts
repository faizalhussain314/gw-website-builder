import { wordpressAxios } from "@config";

export const getDescriptions = async () => {
  const url = "wp-json/custom/v1/get-form-details";

  try {
    const response = await wordpressAxios.post(url, {
      fields: ["description1", "description2"],
    });

    const result = await response.data;
    return result;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
};

export const updateDescriptions = async (field: string, content: string) => {
  const url = "wp-json/custom/v1/update-form-details";

  if (!content) {
    console.warn(`Cannot store empty content for ${field}`);
    return;
  }

  try {
    await wordpressAxios.post(url, { [field]: content });
  } catch (error) {
    console.error("Error storing content:", error);
  }
};

export const updateWordCount = async (
  wordCount: number,
  template_id?: number
) => {
  try {
    const updateCountEndpoint = "/wp-json/custom/v1/update-count";
    if (!updateCountEndpoint) {
      console.error("Update count endpoint is not available.");
      return;
    }

    const response = await wordpressAxios.post(updateCountEndpoint, {
      words: wordCount,
      page_title: "Business Description",
      template_id: template_id || "283940",
      sitecount: 0,
      is_type: "words",
    });
    if (response.status !== 200) {
      console.error("Failed to update word count:", response.data);

      return false;
    }

    return true;
  } catch (error) {
    console.error("Error updating word count:", error);
    return error;
  }
};
