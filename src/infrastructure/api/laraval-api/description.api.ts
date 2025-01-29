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
  description1: string,
  description2: string,
  previousDescription?: string
): Promise<ReadableStreamDefaultReader> => {
  let url = `${API_URL}ai/builder/description?businessName=${encodeURIComponent(
    businessName
  )}&category=${encodeURIComponent(category ?? "")}&type=${type}`;

  console.log(
    "previous description",
    previousDescription.length >= 0,
    type === 2
  );
  console.log("type === 1 && description1", description1);

  if (type === 2 && previousDescription.length >= 0) {
    url += `&description1=${encodeURIComponent(
      description1
    )}&userContent=${encodeURIComponent(description2)}`;
    console.log("first block type === 2 && previousDescription");
  } else if (type === 1 && description1) {
    url += `&userContent=${encodeURIComponent(description1)}`;
    // if (previousDescription) {
    //   url += `&previousContent=${encodeURIComponent(previousDescription)}`;
    //   console.log("2nd block", type === 1 && description1);
    // }
  }

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
