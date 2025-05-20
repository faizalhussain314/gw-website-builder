import { useState, useEffect, useCallback } from "react";
import { savePagesToDB } from "../infrastructure/api/wordpress-api/final-preview/savePagesApi.api"; // Import the API function
import useDomainEndpoint from "./useDomainEndpoint"; // Use the hook here

interface Page {
  name: string;
  status: string;
  slug: string;
  selected: boolean;
}

const usePageData = (initialPages: Page[]) => {
  const [pages, setPages] = useState<Page[]>(initialPages);
  const [updatedPages, setUpdatedPages] = useState<Page[]>([]); // Track only updated pages
  const { getDomainFromEndpoint } = useDomainEndpoint();

  // Function to store the updated pages to the database
  const storePages = useCallback(
    async (pagesToSave: Page[]) => {
      const endpoint = getDomainFromEndpoint("/wp-json/custom/v1/save-pages");
      if (endpoint) {
        try {
          await savePagesToDB(endpoint, pagesToSave, 0);
        } catch (error) {
          console.error("Failed to store updated pages:", error);
        }
      }
    },
    [getDomainFromEndpoint]
  );

  // Track changes in the 'pages' state and store only changed pages
  useEffect(() => {
    if (updatedPages.length > 0) {
      storePages(updatedPages);
      setUpdatedPages([]); // Clear the updated pages after saving
    }
  }, [updatedPages, storePages]);

  // Function to update specific pages and track changes
  const updatePages = (newPages: Page[]) => {
    setPages((prevPages) => {
      const updated = newPages.filter((newPage) =>
        prevPages.some(
          (page) =>
            page.name === newPage.name &&
            (page.status !== newPage.status ||
              page.selected !== newPage.selected)
        )
      );
      setUpdatedPages(updated); // Track only updated pages
      return newPages; // Update the state with the new pages
    });
  };

  return { pages, setPages: updatePages }; // Provide setPages as 'updatePages'
};

export default usePageData;
