import { useDispatch } from "react-redux";
import { setWpToken } from "../Slice/userSlice";
import useDomainEndpoint from "./useDomainEndpoint";
import axios from "axios";

const useFetchWpToken = () => {
  const dispatch = useDispatch();
  const { getDomainFromEndpoint } = useDomainEndpoint();

  const fetchToken = async () => {
    try {
      const url = getDomainFromEndpoint("/wp-json/custom/v1/get-user-token");
      const response = await axios.get(url);
      const result = response.data;

      if (result.status && result.token) {
        dispatch(setWpToken(result.token));
      } else {
        console.error("Failed to fetch token: Invalid response");
      }
    } catch (error) {
      console.error("Error fetching user token:", error);
    }
  };

  return { fetchToken }; // Ensure fetchToken is returned
};

export default useFetchWpToken;
