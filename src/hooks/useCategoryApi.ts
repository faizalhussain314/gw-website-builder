import { useState, useEffect } from "react";
import { CategoryList } from "types/Category.type";
import { fetchCategoryList } from "@api/laraval-api/categorylist.api";

const useCategoryApi = () => {
  const [categoryList, setCategoryList] = useState<CategoryList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const categories = await fetchCategoryList();
        setCategoryList(categories);
        setError(null);
      } catch (err) {
        console.error("Error fetching category list:", err);
        setError("Failed to fetch category list. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categoryList, isLoading, error: error as string | null };
};

export default useCategoryApi;
