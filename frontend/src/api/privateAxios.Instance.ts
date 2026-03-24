import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { authAxiosInstance } from "./authAxios.Instance";
import { store } from "../store/store";
import { clearUser } from "../store/userSlice";
import { toast } from "sonner";

export const privateAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PVT_URL,
  withCredentials: true,
});

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve();
  });
  failedQueue = [];
};

interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

privateAxiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest;
    const responseData = error.response?.data as { forceLogout?: boolean; message?: string } | undefined;

    // Handle force logout for blocked users
    if (responseData?.forceLogout) {
      store.dispatch(clearUser());
      toast.error(responseData.message || "Your account has been blocked by admin.");
      
      if (typeof window !== "undefined") {
        window.location.href = "/login"; // Redirect to login
      }
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => privateAxiosInstance(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await authAxiosInstance.post("/refresh-token");

      processQueue(null);
      isRefreshing = false;
      return privateAxiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError as AxiosError);
      isRefreshing = false;

      // Logout on refresh failure
      store.dispatch(clearUser());
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return Promise.reject(refreshError);
    }
  }
);
