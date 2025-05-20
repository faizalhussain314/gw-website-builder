import wordpressAxios from "@config/wordpressAxios";

// Utility function for fetching the WP token
export const fetchWpToken = async () => {
  try {
    const response = await wordpressAxios.get(
      "/wp-json/custom/v1/get-user-token"
    );
    const result = response.data;

    if (result.status && result.token) {
      console.log("Token fetched successfully:", result.token);
      return result.token;
    } else {
      console.error("Failed to fetch token: Invalid response");
      return null;
    }
  } catch (error) {
    console.log("Error fetching user token:", error);
    return null;
  }
};
