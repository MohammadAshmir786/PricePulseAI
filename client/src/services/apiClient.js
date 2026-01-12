import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL: API_BASE_URL, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("pp_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    // Only try to refresh if we have a token and it's not already a refresh request
    const hasToken = localStorage.getItem("pp_token");
    const isRefreshRequest = original.url?.includes("/auth/refresh");

    if (
      error.response?.status === 401 &&
      !original._retry &&
      hasToken &&
      !isRefreshRequest
    ) {
      original._retry = true;
      try {
        const refreshRes = await api.post("/auth/refresh");
        const newToken = refreshRes.data.token;
        if (newToken) {
          localStorage.setItem("pp_token", newToken);
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        }
      } catch (e) {
        localStorage.removeItem("pp_token");
        // Optionally redirect to login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
