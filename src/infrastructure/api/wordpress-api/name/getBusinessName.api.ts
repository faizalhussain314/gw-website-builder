import { wordpressAxios } from "@config/index";

export const getBusinessName = async () => {
  const url = "wp-json/custom/v1/get-form-details";

  try {
    const response = await wordpressAxios.post(url, {
      fields: ["businessName"],
    });

    const result = await response.data;
    console.log("results", result);
    return result;
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
};
