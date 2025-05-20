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
  pages: Page[],
  currentIndex: number
): Promise<boolean> => {
  try {
    const pagename = pages[currentIndex]?.name;
    const pagestatus = pages[currentIndex]?.status;
    const pageslug = pages[currentIndex]?.slug;
    const selectedvalue = pages[currentIndex]?.selected;
    if (!pagestatus) {
      return;
    }

    const response = await axios.post(endpoint, {
      page_name: pagename,
      page_status: pagestatus,
      page_slug: pageslug,
      selected: selectedvalue,
    });
    if (response.status) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error storing pages:", error);
    throw error;
  }
};
