import axios from "axios";

const axiosApi = axios.create({
  baseURL: "http://localhost:4000/api",
  headers: {"Content-Type": "application/json"}
});

axiosApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

 axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default axiosApi;