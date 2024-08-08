import { useQuery } from "react-query";
import { API_URL } from "../constants";

export function useClassifiersQuery() {
  const classifiersQuery = useQuery("classifiers", getClassifiers);
  return classifiersQuery;
}

async function getClassifiers() {
  const response = await fetch(API_URL + "/classifiers");
  if (!response.ok) {
    throw new Error("Response was not OK");
  }
  return response.json();
}
