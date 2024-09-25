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
    const pagename = pages[0]?.name;
    const pagestatus = pages[0]?.status;
    const pageslug = pages[0]?.slug;
    const selectedvalue = pages[0]?.selected;
    const response = await axios.post(endpoint, {
      page_name: pagename,
      page_status: pageslug,
      selected: selectedvalue,
    });
    console.log("Pages stored successfully:", response.data);
  } catch (error) {
    console.error("Error storing pages:", error);
    throw error;
  }
};
