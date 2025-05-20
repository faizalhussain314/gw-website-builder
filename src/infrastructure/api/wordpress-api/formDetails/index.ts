// services/apiService.ts
import { wordpressAxios } from "@config/index";

export const fetchFormDetails = async () => {
  const endpoint = "wp-json/custom/v1/get-form-details";
  try {
    const response = await wordpressAxios.post(endpoint, {
      fields: [
        "businessName",
        "description1",
        "description2",
        "images",
        "designs",
        "templateid",
        "templatename",
        "logo",
        "category",
        "content",
        "color",
        "font",
        "templateList",
        "contactform",
        "lastStep",
      ],
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    throw error;
  }
};

export const emptyTable = async () => {
  const endpoint = "/wp-json/custom/v1/empty-tables";
  try {
    const response = await wordpressAxios.delete(endpoint, {});
    return response.data;
  } catch (error) {
    console.error(`Error clearing table at ${endpoint}:`, error);
    throw error;
  }
};
