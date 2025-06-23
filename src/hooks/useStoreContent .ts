import { useCallback } from "react";
import { wordpressAxios } from "@config";

const useStoreContent = () => {
  const storeContent = useCallback(async (dbColumn: object) => {
    const url = "wp-json/custom/v1/update-form-details";
    try {
      const response = await wordpressAxios.post(url, dbColumn);

      const result = await response.data;
      return result;
    } catch (error) {
      console.error("Error making API call:", error);
      return null;
    }
  }, []);

  return storeContent;
};

export default useStoreContent;
