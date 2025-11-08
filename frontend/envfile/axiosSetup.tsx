import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { deleteCookie } from "cookies-next";
import toast from "react-hot-toast";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  timeout: 5400000, 
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<any>) => {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data;

      if (status === 403) {
        toast.error("Session expired. Redirecting to login page...", {
          className: "text-sm",
        });

        setTimeout(() => {
          deleteCookie("jwtToken");
          localStorage.clear();
          window.location.href = "/";
        }, 1000);
      }

      if (status === 500 && message !== "Access Denied") {
        toast.error("Something went wrong. Please try again later...", {
          className: "text-sm",
        });
      }
    } else {
      toast.error("Network error. Please check your internet connection.", {
        className: "text-sm",
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
