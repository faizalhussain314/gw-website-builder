import axios from "axios";
import store from "../store/store"; // Adjust path if needed

const API_BASE_URL = import.meta.env.VITE_API_BACKEND_URL;

const laravelAxios = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to dynamically inject token
laravelAxios.interceptors.request.use(
  async (config) => {
    let token = store.getState().user.wp_token;

    if (!token) {
      // Try fetching token dynamically if not present
      const fallbackUrl = window.location.href.includes("/wp-admin")
        ? `${
            window.location.href.split("/wp-admin")[0]
          }/wp-json/custom/v1/get-user-token`
        : "https://plugin.mywpsite.org/wp-json/custom/v1/get-user-token";

      try {
        const response = await axios.get(fallbackUrl);
        if (response.data.status && response.data.token) {
          token = response.data.token;
          store.dispatch({ type: "user/setWpToken", payload: token });
        }
      } catch (err) {
        console.error("Token fetch failed in interceptor:", err);
      }
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default laravelAxios;
