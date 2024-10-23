import axios from "axios";

// Accept the endpoint as a parameter
export const deleteStyle = async (
  endpoint: string,
): Promise<any> => {
  try {
    const response = await axios.delete(endpoint);
    console.log("Pages deleted successfully", response.data);
    return response;
  } catch (error) {
    console.error("Error storing pages:", error);
    throw error;
  }
};
