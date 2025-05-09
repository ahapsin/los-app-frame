import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE, // Replace with your API URL
    timeout: 5000, // Optional timeout
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Global error handling (e.g., show a toast notification)
        console.error(error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
