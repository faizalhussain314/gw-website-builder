import axios from "axios";

// Accept the endpoint as a parameter
export const deleteStyle = async (endpoint: string): Promise<boolean> => {
  try {
    const response = await axios.delete(endpoint);

    if (response.status == 200) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error storing pages:", error);
    throw error;
  }
};
