import { laravelAxios } from "@config";
import { Template } from "types/design.type";

export const fetchtemplateList = async (): Promise<Template[]> => {
  try {
    const response = await laravelAxios.get("getTemplates");
    console.log("templatedata", response.data.data);

    // Handle the API response structure
    const apiResponse = response.data;

    // Check if the response is successful
    if (apiResponse.code === 200 && apiResponse.message === "success") {
      // Return the templates array
      return Array.isArray(apiResponse.data) ? apiResponse.data : [];
    } else {
      throw new Error(
        `API returned error: ${apiResponse.message || "Unknown error"}`
      );
    }
  } catch (error) {
    console.error("Error fetching template list:", error);
    throw new Error(`Failed to fetch template list: ${error.message}`);
  }
};
