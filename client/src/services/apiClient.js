import axios from "axios";
import { BASE_URL } from "../assets/constants/constants.js";
const apiClient = axios.create({
  baseURL: BASE_URL,
});
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.log(error);
    const errorMessage =
      error.response?.data?.message || "An error occurred. Please try again later.";
    return Promise.reject(new Error(errorMessage));
  }
);
export default apiClient;
