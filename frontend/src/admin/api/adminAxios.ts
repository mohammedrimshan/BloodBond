import axios from "axios";
import { store } from "@/store/store";
import { clearAdmin } from "@/store/adminSlice";

const adminAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api/admin` 
    : "http://localhost:5000/api/admin",
  withCredentials: true,
});

// Interceptor to handle unauthenticated admin requests
adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if it's a 401 and NOT a login attempt itself
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    
    if (error.response?.status === 401 && !isLoginRequest) {
      store.dispatch(clearAdmin());
    }
    return Promise.reject(error);
  }
);

export default adminAxios;
