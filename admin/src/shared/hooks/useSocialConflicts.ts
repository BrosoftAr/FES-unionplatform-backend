import { useState, useEffect } from "react";
import FetchService from "../fetchService";
import ApiEndpoints from "../ApiEndpoints";
import { SocialConflict } from "../SocialConflict";

export type SocialConflictList = (SocialConflict & { categoryTitle: string })[];

interface useSocialConflictsParams {
  searchFilter?: string;
}

const useSocialConflicts = (params: useSocialConflictsParams = {}) => {
  const { searchFilter } = params;

  const [isLoadingSocialConflicts, setIsLoadingSocialConflicts] = useState(
    true
  );
  const [socialConflicts, setSocialConflicts] = useState<SocialConflictList>(
    []
  );

  const fetchSocialConflicts = async () => {
    setIsLoadingSocialConflicts(true);
    const { socialConflicts } = await FetchService.request(
      ApiEndpoints.SOCIAL_CONFLICTS_LIST,
      {
        body: JSON.stringify({ searchFilter }),
      }
    );
    setSocialConflicts(socialConflicts);
    setIsLoadingSocialConflicts(false);
  };

  const fetchSocialConflictsWrap = () => {
    fetchSocialConflicts();
  };

  useEffect(fetchSocialConflictsWrap, [searchFilter]);
  return { isLoadingSocialConflicts, socialConflicts, fetchSocialConflicts };
};
export default useSocialConflicts;
