// File: src/infrastructure/api/wordpress-api/updateDescriptions.api.ts

import { wordpressAxios } from "@config";
import { Template } from "../../../../types/design.type";

// Function to update descriptions in the database
export const saveSelectedTemplate = async (template: Template) => {
  const formData = {
    templateList: template,
    templateid: template.id,
    templatename: template.name,
  };
  try {
    await wordpressAxios.post(
      "wp-json/custom/v1/update-form-details",
      formData
    );
  } catch (error) {
    console.error("Error in saving template:", error);
    throw new Error("Failed to save template");
  }
};
