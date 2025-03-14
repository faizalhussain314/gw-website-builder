import axios from "axios";
import { getDomainFromEndpoint } from "../getDomainFromEndpoint.utils";

export const checkSiteCount = async () => {
  const endpoint = getDomainFromEndpoint("/wp-json/custom/v1/check-site-count");
  try {
    const response = await axios.get(endpoint);
    if (response?.data?.status === false) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error checking site count:", error);
    return false;
  }
};
