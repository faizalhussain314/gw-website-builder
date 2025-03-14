// pageUtils.ts
import axios from "axios";
import { getDomainFromEndpoint } from "../getDomainFromEndpoint.utils"; // Adjust import path
import { NavigateFunction } from "react-router-dom";

export const nextPage = async (
  setWordCountLoader: React.Dispatch<React.SetStateAction<boolean>>,
  setLimitReached: React.Dispatch<React.SetStateAction<boolean>>,
  setPlanExpired: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: NavigateFunction
) => {
  setWordCountLoader(true);
  try {
    const endpoint = getDomainFromEndpoint(
      "wp-json/custom/v1/check-word-count"
    );

    const response = await axios.get(endpoint);

    if (response?.data?.status === true) {
      navigate("/final-preview");
    } else if (response?.data?.status === false) {
      setWordCountLoader(false);
      setLimitReached(true);
    } else if (
      response?.data?.status === "pending" ||
      response?.data?.status === "canceled" ||
      response?.data?.status === "overdue"
    ) {
      setPlanExpired(true);
    }
  } catch (error) {
    console.error("Error while calling the word count API:", error);
    setWordCountLoader(false);
  }
};
