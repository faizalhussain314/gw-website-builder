import store from "../../../store/store";
import { fetchWpToken } from "../../../core/utils/fetchWpToken";
import { Dispatch } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export const fetchDescriptionStream = async (
  dispatch: Dispatch,
  getDomainFromEndpoint: (args: string) => string,
  businessName: string,
  category: string | null,
  type: 1 | 2,
  previousDescription?: string
): Promise<ReadableStreamDefaultReader> => {
  let url = `${API_URL}ai/builder/description?businessName=${businessName}&category=${category}&type=${type}`;
  if (type === 2 && previousDescription) {
    url += `&description1=${encodeURIComponent(previousDescription)}`;
  }

  // Fetch wp_token from Redux or API
  let wp_token = store.getState().user.wp_token;

  if (!wp_token) {
    console.log("wp_token not found in Redux, fetching new token...");
    wp_token = await fetchWpToken(dispatch, getDomainFromEndpoint);
  }

  if (!wp_token) {
    console.error("Failed to fetch Bearer token.");
    throw new Error("Missing Bearer token. Cannot proceed with API call.");
  }

  console.log("Using Bearer token:", wp_token);

  // Make API call with Bearer token
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${wp_token}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch description API:", response.statusText);
    throw new Error("Failed to fetch description");
  }

  console.log("Description API response received.");
  return response.body?.getReader();
};
