import axios from "axios";
import { getDomainFromEndpoint } from "../getDomainFromEndpoint.utils";

export const sendTokenAndEmailToBackend = async (
  wp_token: string,
  fe_token: string,
  email: string
) => {
  try {
    const endpoint = getDomainFromEndpoint(
      "wp-json/custom/v1/user-details-react"
    );
    await axios.post(endpoint, { wp_token, fe_token, email });
  } catch (error) {
    console.error("Error sending user details:", error);
    throw error;
  }
};
