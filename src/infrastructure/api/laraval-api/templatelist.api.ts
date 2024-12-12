import { templatelist } from "../../../types/Preview.type";
import { getToken } from "../../../core/utils/tokenUtil";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export const fetchtemplateList = async (): Promise<templatelist[]> => {
  const token = getToken();

  if (!token) {
    return;
  }
  const response = await fetch(`${API_URL}getTemplates`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category list");
  }

  const data = await response.json();
  return data.data;
};
