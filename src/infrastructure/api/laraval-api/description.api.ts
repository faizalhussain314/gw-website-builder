import store from "../../../store/store";
import { fetchWpToken } from "../../../core/utils/fetchWpToken";
import { Dispatch } from "@reduxjs/toolkit";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export const fetchDescriptionStream = async (
  dispatch: Dispatch,
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

  if (type === 2 && previousDescription.length >= 0) {
    url += `&description1=${encodeURIComponent(
      description1
    )}&userContent=${encodeURIComponent(description2)}`;
  } else if (type === 1 && description1) {
    url += `&userContent=${encodeURIComponent(description1)}`;
  }

  let wp_token = store.getState().user.wp_token;

  if (!wp_token) {
    wp_token = await fetchWpToken(dispatch);
  }

  if (!wp_token) {
    console.error("Failed to fetch Bearer token.");
    throw new Error("Missing Bearer token. Cannot proceed with API call.");
  }

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

  return response.body?.getReader();
};
