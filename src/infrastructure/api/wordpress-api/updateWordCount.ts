import wordpressAxios from "@config/wordpressAxios";

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
