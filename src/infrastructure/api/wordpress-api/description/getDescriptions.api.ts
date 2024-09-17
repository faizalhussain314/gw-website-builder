import { GetDomainFromEndpointType } from "../../../../types/apiTypes.type";

export const getDescriptions = async (
  getDomainFromEndpoint: GetDomainFromEndpointType
) => {
  const url = getDomainFromEndpoint("wp-json/custom/v1/get-form-details");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: ["description1", "description2"] }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
};
