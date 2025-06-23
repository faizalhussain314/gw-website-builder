import { wordpressAxios } from "@config";

export const updateFormDetail = async (dbColumn: object) => {
  const url = "wp-json/custom/v1/update-form-details";
  try {
    const response = await wordpressAxios.post(url, dbColumn);

    const result = await response.data;
    return result;
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
};
