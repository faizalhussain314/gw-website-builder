import wordpressAxios from "@config/wordpressAxios";

// Function to update category details
export const updateCategoryDetails = async (content: string) => {
  const url = "wp-json/custom/v1/update-form-details";

  try {
    const response = await wordpressAxios.post(url, { category: content });

    const result = await response.data;
    return result;
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
};
