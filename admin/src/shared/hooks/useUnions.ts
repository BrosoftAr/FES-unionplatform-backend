import { useState, useEffect } from "react";
import FetchService from "../fetchService";
import ApiEndpoints from "../ApiEndpoints";
import { Union } from "../Union";

const useUnions = () => {
  const [isLoadingUnions, setIsLoadingUnions] = useState(true);
  const [unions, setUnions] = useState<Union[]>([]);

  const fetchUnions = async () => {
    setIsLoadingUnions(true);
    const { unions } = await FetchService.request(ApiEndpoints.UNIONS_LIST);
    setUnions(unions);
    setIsLoadingUnions(false);
  };

  useEffect(() => {
    fetchUnions();
  }, []);
  return { isLoadingUnions, unions, fetchUnions };
};
export default useUnions;
