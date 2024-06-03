import axios from "axios";

// Create a custom axios instance
const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api", // Replace with your API URL
});

// Function to add token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;