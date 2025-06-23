import { wordpressAxios } from "@config/index";

export const updateBusinessName = async (content: string) => {
  const url = "wp-json/custom/v1/update-form-details";

  try {
    const response = await wordpressAxios.post(url, { businessName: content });

    const result = await response.data;
    return result;
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
};
