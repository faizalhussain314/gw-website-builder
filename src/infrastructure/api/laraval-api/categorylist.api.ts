import { CategoryList } from "../../../types/Category.type";
import axios from "axios";
import store from "../../../store/store";
import { fetchWpToken } from "../../../core/utils/fetchWpToken";
import { Dispatch } from "redux";
// import useDomainEndpoint from "../../../hooks/useDomainEndpoint";

const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export const fetchCategoryList = async (
  dispatch: Dispatch,
  getDomainFromEndpoint: (args: string) => string
): Promise<CategoryList[]> => {
  try {
    let wp_token = store.getState().user.wp_token;

    if (!wp_token) {
      console.log("Fetching wp_token...");
      wp_token = await fetchWpToken(dispatch, getDomainFromEndpoint);
    }

    if (!wp_token) {
      throw new Error("Missing wp_token. Cannot fetch category list.");
    }

    console.log("Fetching category list with token:", wp_token);
    const response = await axios.get(`${API_URL}ai/builder/category-list`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${wp_token}`,
      },
    });

    console.log("Category list API response:", response.data);
    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching category list:", error);
    throw error;
  }
};
