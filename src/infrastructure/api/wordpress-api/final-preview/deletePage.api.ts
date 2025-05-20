import axios from "axios";

// Accept the endpoint as a parameter
export const deletePage = async (endpoint: string): Promise<string> => {
  try {
    const response = await axios.delete(endpoint);

    return response.data;
  } catch (error) {
    console.error("Error storing pages:", error);
    throw error;
  }
};
