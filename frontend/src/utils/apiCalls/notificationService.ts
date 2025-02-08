import axios from "axios";
import { NOTIFICATION_SERVICE_URL } from "../constants";
import { deleteCookie } from "../deleteCookie";
import Router from "next/router";

const apiClient = axios.create({
  baseURL: NOTIFICATION_SERVICE_URL,
  withCredentials: true,
  timeout: 120000,
});

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      deleteCookie("token");
      Router.replace("/");
    }
    return Promise.reject(error); // Reject the promise for other errors
  }
);

export default {
  getNotifications: async function () {
    try {
      const res = await apiClient.get("/");
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to get notification data";
      throw new Error(errorMessage);
    }
  },
};
