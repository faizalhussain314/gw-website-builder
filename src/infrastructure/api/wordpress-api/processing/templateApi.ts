// services/apiService.ts
import { getDomainFromEndpoint } from "../../../../core/utils/getDomainFromEndpoint.utils";

export const fetchTemplateData = async (templateId: number): Promise<any> => {
  const API_URL = import.meta.env.VITE_API_BACKEND_URL;
  try {
    const response = await fetch(
      `${API_URL}getTemplates?template_id=${templateId}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch templates");
    }
    return data.data;
  } catch (error) {
    console.error("Error fetching templates:", error);
    return null;
  }
};

export const postData = async (
  endpoint: string,
  data: object,
  method: "POST" | "DELETE" = "POST"
): Promise<any> => {
  const url = getDomainFromEndpoint(endpoint);
  if (!url) return null;

  try {
    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`Error posting data to ${url}`);
    return await response.json();
  } catch (error) {
    console.error(`Error in API call (${method}) to ${url}:`, error);
    return null;
  }
};
