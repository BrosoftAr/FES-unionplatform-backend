import { useState, useEffect } from "react";
import FetchService from "../fetchService";
import ApiEndpoints from "../ApiEndpoints";

interface useArticleDetailsProps {
  links?: string[];
}

interface ArticleInfo {
  id: number;
  titulo: string;
  descripcion: string;
  miniatura: string;
  link: string;
}

const useArticleDetails = ({ links }: useArticleDetailsProps) => {
  const [isLoadingArticleDetails, setIsLoadingArticleDetails] = useState(true);
  const [articleDetails, setArticleDetails] = useState<ArticleInfo[]>([]);

  const fetchArticleDetails = async () => {
    if (!links || !links.length) {
      setArticleDetails([]);
      return;
    }

    try {
      setIsLoadingArticleDetails(true);
      const requestPromise = FetchService.request(
        ApiEndpoints.ARTICLES_GET_DETAILS,
        {
          body: JSON.stringify({ links }),
        }
      );
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve([]);
        }, 8000);
      });

      const articleDetailsResult = await Promise.race([
        requestPromise,
        timeoutPromise,
      ]);
      setArticleDetails(articleDetailsResult);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoadingArticleDetails(false);
    }
  };

  const fetchArticleDetailsAsyncWrapper = () => {
    fetchArticleDetails();
  };

  // console.log("links", links);
  useEffect(fetchArticleDetailsAsyncWrapper, [links?.join()]);

  return { articleDetails, isLoadingArticleDetails };
};
export default useArticleDetails;
