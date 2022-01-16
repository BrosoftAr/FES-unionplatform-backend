import { useState, useEffect } from "react";
import FetchService from "../fetchService";
import ApiEndpoints from "../ApiEndpoints";
import { Category } from "../Category";

const useCategories = () => {
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    const { categories } = await FetchService.request(
      ApiEndpoints.CATEGORIES_LIST
    );
    setCategories(categories);
    setIsLoadingCategories(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return { isLoadingCategories, categories, fetchCategories };
};
export default useCategories;
