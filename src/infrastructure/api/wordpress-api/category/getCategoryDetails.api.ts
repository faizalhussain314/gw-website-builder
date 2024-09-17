import { GetDomainFromEndpointType } from "../../../../types/apiTypes.type";

export const getCategoryDetails = async (
  getDomainFromEndpoint: GetDomainFromEndpointType
) => {
  const url = getDomainFromEndpoint("wp-json/custom/v1/get-form-details");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: ["category"],
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
};
