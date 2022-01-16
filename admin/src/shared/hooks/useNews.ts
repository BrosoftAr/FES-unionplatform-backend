import { useState, useEffect } from "react";
import FetchService from "../fetchService";
import ApiEndpoints from "../ApiEndpoints";
import { News } from "../News";

interface useNewsParams {
  limit?: number;
}

const useNews = ({ limit = 0 }: useNewsParams) => {
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [news, setNews] = useState<News[]>([]);

  const fetchNews = async () => {
    setIsLoadingNews(true);
    const { news } = await FetchService.request(ApiEndpoints.NEWS_LIST, {
      body: JSON.stringify(limit),
    });
    setNews(news);
    setIsLoadingNews(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);
  return { isLoadingNews, news, fetchNews };
};
export default useNews;
