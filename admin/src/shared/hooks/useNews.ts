import { useState, useEffect } from "react";
import FetchService from "../fetchService";
import ApiEndpoints from "../ApiEndpoints";
import { News } from "../News";

const useNews = () => {
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [news, setNews] = useState<News[]>([]);

  const fetchNews = async () => {
    setIsLoadingNews(true);
    const { news } = await FetchService.request(ApiEndpoints.NEWS_LIST);
    setNews(news);
    setIsLoadingNews(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);
  return { isLoadingNews, news, fetchNews };
};
export default useNews;
