  import axios from "axios";
  import { CLAVE_TOKEN } from "../utils/constants";

  const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  // Request: agrega el token a CADA petición automáticamente - ningún
  // componente tiene que acordarse de hacerlo por su cuenta.

  axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(CLAVE_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
      return Promise.reject(error);
    }
  );

  axiosClient.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(CLAVE_TOKEN);
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );

  export default axiosClient;