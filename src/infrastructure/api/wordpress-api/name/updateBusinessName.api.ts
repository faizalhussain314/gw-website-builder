import { GetDomainFromEndpointType } from "../../../../types/apiTypes.type";

export const updateBusinessName = async (
  content: string,
  getDomainFromEndpoint: GetDomainFromEndpointType
) => {
  const url = getDomainFromEndpoint("wp-json/custom/v1/update-form-details");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ businessName: content }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
};
