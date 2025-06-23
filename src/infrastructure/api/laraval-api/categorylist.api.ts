import { CategoryList } from "../../../types/Category.type";
import laravelAxios from "@config/laravelAxios";

export const fetchCategoryList = async (): Promise<CategoryList[]> => {
  try {
    const response = await laravelAxios.get(`ai/builder/category-list`);

    return response?.data?.data || [];
  } catch (error) {
    console.error("Error fetching category list:", error);
    throw error;
  }
};
