import axios from "axios";

const instance = axios.create({
  baseURL: "https://crispy-zebra-977qqrpw467j3p96g-5000.app.github.dev/api",
});

// Interceptor to attach token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Log or handle token retrieval or config errors
    console.error("Axios request error:", error);
    return Promise.reject(error);
  }
);

export default instance;
