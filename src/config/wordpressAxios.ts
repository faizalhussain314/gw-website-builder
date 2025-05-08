// services/wordpressAxios.ts
import axios from "axios";
import { getDomainFromEndpoint } from "../core/utils/getDomainFromEndpoint.utils";

// Create an axios instance for WordPress API
const wordpressAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

wordpressAxios.interceptors.request.use((config) => {
  config.url = getDomainFromEndpoint(config.url || "");
  return config;
});

export default wordpressAxios;
