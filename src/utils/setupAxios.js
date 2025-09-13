import axios from "axios";
import { API_BASE } from "../config.js";

const axiosInstance = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

// Always use credentials: "include" for CSRF token fetch
axiosInstance.interceptors.request.use(async (config) => {
    const tokenResponse = await axios.get(
        `${API_BASE}/events/get-csrf-token/`,
        { withCredentials: true }
    );
    const csrfToken = tokenResponse.data.csrfToken;
    config.headers["X-CSRFToken"] = csrfToken;
    config.withCredentials = true; // Ensure credentials are included in all requests
    return config;
});

export default axiosInstance;