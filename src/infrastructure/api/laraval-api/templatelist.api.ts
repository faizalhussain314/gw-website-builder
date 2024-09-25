import { templatelist } from "../../../types/Preview.type";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export const fetchtemplateList = async (): Promise<templatelist[]> => {
  const response = await fetch(`${API_URL}getTemplates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category list");
  }

  const data = await response.json();
  return data.data;
};
