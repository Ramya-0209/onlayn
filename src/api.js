import axios from "axios";
import { toast } from "sonner";

const API = axios.create({
  baseURL: "https://apis.toyshack.in",
  timeout: 10000, 
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let sessionExpired = false; 

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401 && !sessionExpired) {
      sessionExpired = true;

      toast.error("⚠️ Session expired, please login again");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setTimeout(() => {
        window.location.href = "/login";
        sessionExpired = false; 
      }, 1500);
    }

    return Promise.reject(error);
  }
);

export default API;
