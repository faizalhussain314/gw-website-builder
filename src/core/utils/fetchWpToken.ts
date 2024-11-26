import axios from "axios";
import { Dispatch } from "@reduxjs/toolkit";
import { setWpToken } from "../../Slice/userSlice";
// import useDomainEndpoint from "../hooks/useDomainEndpoint";

export const fetchWpToken = async (
  dispatch: Dispatch,
  getDomainFromEndpoint: (args: string) => string
) => {
  try {
    const url = getDomainFromEndpoint("/wp-json/custom/v1/get-user-token");
    const response = await axios.get(url);
    const result = response.data;

    if (result.status && result.token) {
      dispatch(setWpToken(result.token)); // Store token in Redux
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
