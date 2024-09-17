import { useCallback } from "react";
import useDomainEndpoint from "./useDomainEndpoint";

const useStoreContent = () => {
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const storeContent = useCallback(
    async (dbColumn: object) => {
      const url = getDomainFromEndpoint(
        "wp-json/custom/v1/update-form-details"
      );
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dbColumn),
        });

        const result = await response.json();
        return result;
      } catch (error) {
        console.error("Error making API call:", error);
        return null;
      }
    },
    [getDomainFromEndpoint]
  );

  return storeContent;
};

export default useStoreContent;
