import { useState, useEffect } from "react";
import { message } from "antd";
import FetchService from "../fetchService";
import ApiEndpoints from "../ApiEndpoints";
import { Article } from "../Article";

const useLatestArticles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoadingArticles(true);
        const { articles } = await FetchService.request(
          ApiEndpoints.ARTICLES_GET_LATEST
        );
        setArticles(articles);
        setIsLoadingArticles(false);
      } catch (e) {
        message.error(JSON.stringify(e));
      }
    };
    fetchArticles();
  }, []);

  return { articles, isLoadingArticles };
};
export default useLatestArticles;
