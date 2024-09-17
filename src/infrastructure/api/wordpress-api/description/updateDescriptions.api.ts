// File: src/infrastructure/api/wordpress-api/updateDescriptions.api.ts

type GetDomainFromEndpointType = (endpoint: string) => string;

// Function to update descriptions in the database
export const updateDescriptions = async (
  field: string,
  content: string,
  getDomainFromEndpoint: GetDomainFromEndpointType
) => {
  const url = getDomainFromEndpoint("wp-json/custom/v1/update-form-details");

  if (!content) {
    console.warn(`Cannot store empty content for ${field}`);
    return;
  }

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [field]: content }),
    });
  } catch (error) {
    console.error("Error storing content:", error);
  }
};
