import constants from "@/constants";
import services from "@/services";
import axios from "axios";



const instance = axios.create({
  baseURL: constants.api.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

// Middleware: Requisição - Token
instance.interceptors.request.use(async (config) => {
  // const token = services.localStorage.getToken();
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }

  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.clear();
      // services.auth.logOut();
    }
    return Promise.reject(error);
  }
);

export default instance;
