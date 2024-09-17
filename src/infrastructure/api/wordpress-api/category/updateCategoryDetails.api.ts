import { GetDomainFromEndpointType } from "../../../../types/apiTypes.type";

// Function to update category details
export const updateCategoryDetails = async (
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
      body: JSON.stringify({ category: content }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error making API call:", error);
    return null;
  }
};
