import axios from "axios";
import { USER_SERVICE_URL } from "../constants";
import { deleteCookie } from "../deleteCookie";
import Router from "next/router";

const userServiceUrl = USER_SERVICE_URL;
const userServiceAdminUrl = `${USER_SERVICE_URL}/admin`;

const apiClient = axios.create({
  baseURL: USER_SERVICE_URL,
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
    return Promise.reject(error);
  }
);

type Inputs = {
  username: string;
  password: string;
};
type editProfileInputs = {
  _id?: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  dateOfBirth: string;
};
type signupInputs = {
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};
type otpInputs = {
  _id: string;
  otp: string;
};
type sentOtpInputs = {
  _id?: string;
  email: string;
  dateOfBirth: Date;
  gender: string;
};

export default {
  googleSignin: async function (credentialResponse: any) {
    try {
      const res = await axios.post(
        `${USER_SERVICE_URL}/login/googleSignin`,
        credentialResponse,
        {
          withCredentials: true,
        }
      );
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  userLogin: async function (data: Inputs) {
    try {
      const res = await axios.post(`${userServiceUrl}/login`, data, {
        withCredentials: true,
      });
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  userSignup: async function (data: signupInputs) {
    try {
      const res = await axios.post(`${USER_SERVICE_URL}/signup`, data, {
        withCredentials: true,
      });
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  verifyOTP: async function (data: otpInputs) {
    try {
      const res = await axios.post(
        `${USER_SERVICE_URL}/signup/verifyOTP`,
        data,
        {
          withCredentials: true,
        }
      );
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  resentOTP: async function ({ _id }: { _id: string }) {
    try {
      const res = await axios.post(
        `${USER_SERVICE_URL}/signup/reSendOTP`,
        { _id },
        {
          withCredentials: true,
        }
      );
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  sentOTP: async function (data: sentOtpInputs) {
    try {
      const res = await axios.post(`${USER_SERVICE_URL}/signup/sendOTP`, data, {
        withCredentials: true,
      });
      return res;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  changePassword: async function (
    currentPassword: string,
    newPassword: string
  ) {
    try {
      const url = `${userServiceUrl}/changePassword`;
      const res = await axios.patch(
        url,
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to change password";
      throw new Error(errorMessage);
    }
  },
  forgotPassword: async function (email: string) {
    try {
      const url = `${userServiceUrl}/forgotPassword`;
      const res = await axios.post(url, { email });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to get new password";
      throw new Error(errorMessage);
    }
  },

  getCurrUserData: async function () {
    try {
      const url = `${userServiceUrl}/profile/userData`;
      const res = await axios.get(url, { withCredentials: true });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to get current user data";
      throw new Error(errorMessage);
    }
  },
  addCoverImage: async function (formData: FormData) {
    try {
      const url = `${userServiceUrl}/profile/userData/image/coverPic`;
      const res = await axios.patch(url, formData, { withCredentials: true });

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to add Cover Image";
      throw new Error(errorMessage);
    }
  },

  updateProfilePic: async function (formData: FormData) {
    try {
      const url = `${userServiceUrl}/profile/userData/image/profilePic`;
      const res = await axios.patch(url, formData, { withCredentials: true });

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to update Profile Image";
      throw new Error(errorMessage);
    }
  },

  editProfile: async function (data: editProfileInputs) {
    try {
      const url = `${USER_SERVICE_URL}/profile/userData`;
      const res = await axios.put(url, data, { withCredentials: true });

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to update Profile Image";
      throw new Error(errorMessage);
    }
  },
  getUserData: async function (id: string) {
    try {
      const url = `${userServiceUrl}/profile/userData/${id}`;
      const res = await axios.get(url, { withCredentials: true });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to get current user data";
      throw new Error(errorMessage);
    }
  },
  getProfileData: async function (username: string) {
    try {
      const url = `${userServiceUrl}/profile/${username}`;
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to get new password";
      throw new Error(errorMessage);
    }
  },
  isFollowing: async function (userId: string) {
    try {
      const url = `${userServiceUrl}/profile/isFollowing/${userId}`;
      const res = await axios.get(url, { withCredentials: true });
      return res.data; // returns isFollowing : Boolean
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to toggle follow";
      throw new Error(errorMessage);
    }
  },
  getFollowingUsers: async function () {
    try {
      const url = `${userServiceUrl}/profile/getFollowing`;
      const res = await axios.get(url, { withCredentials: true });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to get following users";
      throw new Error(errorMessage);
    }
  },
  toggleFollow: async function (userId: string) {
    try {
      const url = `${userServiceUrl}/profile/toggleFollow/${userId}`;
      const res = await axios.patch(url, {}, { withCredentials: true });
      return res.data; // returns isFollowing : Boolean
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to toggle follow";
      throw new Error(errorMessage);
    }
  },
  toggleRemove: async function (userId: string) {
    try {
      const url = `${userServiceUrl}/profile/toggleRemove/${userId}`;
      const res = await axios.delete(url, { withCredentials: true });
      return res.data; // returns isFollowing : Boolean
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to toggle follow";
      throw new Error(errorMessage);
    }
  },
  searchUsers: async function (keyword: string) {
    try {
      const url = `${userServiceUrl}/profile/search`;
      const res = await axios.get(url, {
        params: { keyword },
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to toggle follow";
      throw new Error(errorMessage);
    }
  },

  blockUser: async function (userId: string) {
    try {
      const url = `${userServiceUrl}/profile/toggleBlock/${userId}`;
      const res = await axios.patch(url, {}, { withCredentials: true });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to toggle follow";
      throw new Error(errorMessage);
    }
  },

  isBlocked: async function (userId: string) {
    try {
      const url = `${userServiceUrl}/profile/isBlocked/${userId}`;
      const res = await axios.get(url, { withCredentials: true });
      return res.data; // returns isBlocked : Boolean
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to get isBlocked data";
      throw new Error(errorMessage);
    }
  },

  changeAccountType: async function (accountType: string): Promise<string> {
    try {
      const url = `${userServiceUrl}/changeAccountType`;
      const res = await axios.patch(
        url,
        { accountType },
        { withCredentials: true }
      );
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to change account type";
      throw new Error(errorMessage);
    }
  },

  getBlockedUsers: async function (pageNo: number, rowsPerPage: number) {
    try {
      const url = `${userServiceUrl}/profile/getBlockedUsers/?pageNo=${pageNo}&rowsPerPage=${rowsPerPage}`;
      const res = await axios.get(url, { withCredentials: true });
      const [responseFormat, documentCount] = res.data;
      return [responseFormat, documentCount];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  requestWenetTick: async function (formData: FormData) {
    try {
      const url = `${userServiceUrl}/requestWenetTick`;
      const res = await axios.post(url, formData, {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  hasRequestedTick: async function () {
    try {
      const url = `${userServiceUrl}/hasRequestedTick`;
      const res = await axios.get(url, {
        withCredentials: true,
      });
      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
  hasWenetTick: async function (username: string) {
    try {
      const url = `${userServiceUrl}/hasWenetTick/${username}`;
      const res = await axios.get(url);
      return res.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  restrictUserByAdmin: async function (userId: string, days: number) {
    try {
      const url = `${userServiceAdminUrl}/restrictUser/${userId}`;
      const body = { restrictionPeriod: days }; // Send restriction period in days
      const res = await axios.put(url, body, { withCredentials: true });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to restrict user";
      throw new Error(errorMessage);
    }
  },
};
