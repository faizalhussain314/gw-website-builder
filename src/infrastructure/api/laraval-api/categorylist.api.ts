import { CategoryList } from "../../../types/Category.type";

// const API_URL = "https://dev.gravitywrite.com/api";
const API_URL = import.meta.env.VITE_API_BACKEND_URL;

export const fetchCategoryList = async (): Promise<CategoryList[]> => {
  const response = await fetch(`${API_URL}ai/builder/category-list`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch category list");
  }

  const data = await response.json();
  return data.data;
};
