import wordpressAxios from "@config/wordpressAxios";

export const checkWordCount = async (): Promise<boolean> => {
  const endpoint = "/wp-json/custom/v1/check-word-count";
  try {
    const response = await wordpressAxios.get(endpoint);
    if (response?.data?.status === true) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking site count:", error);
    throw new Error("Failed to check site count");
  }
};
