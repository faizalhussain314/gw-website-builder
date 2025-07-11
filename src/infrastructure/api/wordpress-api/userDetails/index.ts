// services/wordpressService.ts
import { wordpressAxios } from "@config";

async function getUserDetails() {
  try {
    const response = await wordpressAxios.post(
      "/wp-json/custom/v1/get-gwuser-details",
      {
        fields: [
          "id",
          "name",
          "email",
          "gravator",
          "plan_detail",
          "website_used",
          "website_total",
        ],
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in WordPress API call:", error);
    throw error;
  }
}

export { getUserDetails };
