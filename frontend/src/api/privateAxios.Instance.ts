import axios, {
  AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { authAxiosInstance } from "./authAxios.Instance";

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

      // If you have a logout handler, use that here
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }

      return Promise.reject(refreshError);
    }
  }
);
