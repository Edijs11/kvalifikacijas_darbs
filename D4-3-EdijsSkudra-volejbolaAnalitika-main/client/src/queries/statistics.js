import { useQuery } from "react-query";
import { API_URL } from "../constants";

//statistic page, iegūst visus datus
export function useStatisticsQuery() {
  const statisticsQuery = useQuery("statistics", getStatistics);
  return statisticsQuery;
}

async function getStatistics() {
  const response = await fetch(API_URL + "/statistics");
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}
