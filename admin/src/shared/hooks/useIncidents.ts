import { useState, useEffect } from "react";
import FetchService from "../fetchService";
import ApiEndpoints from "../ApiEndpoints";
import { Incident } from "../Incident";

interface useIncidentsParams {
  limit?: number;
}

const useIncidents = ({ limit = 0 }: useIncidentsParams) => {
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(true);
  const [incidents, setIncidents] = useState<Incident[]>([]);

  const fetchIncidents = async () => {
    setIsLoadingIncidents(true);
    const { incidents } = await FetchService.request(ApiEndpoints.INCIDENTS_LIST, {
      body: JSON.stringify({limit}),
    });
    setIncidents(incidents);
    setIsLoadingIncidents(false);
  };

  useEffect(() => {
    fetchIncidents();
  }, []);
  return { isLoadingIncidents, incidents, fetchIncidents };
};
export default useIncidents;
