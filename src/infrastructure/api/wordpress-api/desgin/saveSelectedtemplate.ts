// File: src/infrastructure/api/wordpress-api/updateDescriptions.api.ts

import { Template } from "../../../../types/design.type";

// Function to update descriptions in the database
export const saveSelectedTemplate = async (
  template: Template,
  endpoint: string
) => {
  const formData = {
    templateList: template,
    templateid: template.id,
    templatename: template.name,
  };
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to save template");
    }

    console.log("Template saved successfully");
  } catch (error) {
    console.error("Error in saving template:", error);
  }
};
