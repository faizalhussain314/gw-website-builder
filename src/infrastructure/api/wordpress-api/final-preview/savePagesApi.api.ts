import axios from "axios";

interface Page {
  name: string;
  status: string;
  slug: string;
  selected: boolean;
}

// Accept the endpoint as a parameter
export const savePagesToDB = async (
  endpoint: string,
  pages: Page[]
): Promise<void> => {
  try {
    const response = await axios.post(endpoint, { pages });
    console.log("Pages stored successfully:", response.data);
  } catch (error) {
    console.error("Error storing pages:", error);
    throw error;
  }
};
