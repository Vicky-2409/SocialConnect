import axios from "axios";
import { POSTS_SERVICE_URL } from "../constants";
import Router from "next/router";
import { deleteCookie } from "@/utils/deleteCookie";

const postServiceUrl = POSTS_SERVICE_URL;
const postServiceAdminUrl = `${POSTS_SERVICE_URL}/admin`;

const apiClient = axios.create({
  baseURL: postServiceUrl,
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

type postInputs = {
  _id: string;
  caption: string;
};

type ReplyCommentProps = {
  postId?: string;
  parentCommentId: string;
  content:string
}

export default {
  //posts
  
  createReply: async function (data: ReplyCommentProps) {
console.log(data);

    try {
      const res = await apiClient.post("/comment/createReply", {
        data,
      });

      return res;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to create Post";
      throw new Error(errorMessage);
    }
  },

  getPublicFeed: async function () {
    try {
      const url = `${postServiceUrl}/publicFeed`;
      const res = await axios.get(url, { withCredentials: false });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data
          : "Failed to get posts data";
      throw new Error(errorMessage);
    }
  },
  getFeed: async function () {
    try {
      // const url = `${postServiceUrl}/feed`;
      // const res = await axios.get(url, { withCredentials: true });

      const res = await apiClient.get("/feed");

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data
          : "Failed to get posts data";
      throw new Error(errorMessage);
    }
  },

  searchPost: async function (keyword: string) {
    try {
      const url = `${postServiceUrl}/search`;
      const res = await apiClient.post("/search", {
        params: { keyword },
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

  createPost: async function (data: postInputs) {
    try {
      console.log(data);

      const res = await apiClient.post("/createPost", {
        data,
      });

      return res;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to create Post";
      throw new Error(errorMessage);
    }
  },
  createPostImage: async function (formData: FormData) {
    try {
      const res = await apiClient.post("/createPost/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response?.data?.length
          ? error.response.data
          : "Failed to create Post Image";
      throw new Error(errorMessage);
    }
  },

  getBookmarkedPosts: async function () {
    try {
      // const url = `${postServiceUrl}/bookmarkedPosts`;
      // const res = await axios.get(url, { withCredentials: true });

      const res = await apiClient.get("/bookmarkedPosts");
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data
          : "Failed to get bookmarked posts";
      throw new Error(errorMessage);
    }
  },
  getProfileFeed: async function (username: string) {
    try {
      // const url = `${postServiceUrl}/profileFeed/${username}`;
      // const res = await axios.get(url, { withCredentials: true });

      const res = await apiClient.get(`/profileFeed/${username}`);

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data
          : "Failed to get posts data";
      throw new Error(errorMessage);
    }
  },

  getSinglePostData: async function (id: string) {
    try {
      // const url = `${postServiceUrl}/singlePost/${id}`;
      // const res = await axios.get(url, { withCredentials: true });

      const res = await apiClient.get(`/singlePost/${id}`);

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to get post data";
      throw new Error(errorMessage);
    }
  },
  editPost: async function (postId: string, caption: string) {
    try {
      // const url = `${postServiceUrl}/editPost/${postId}`;
      // const res = await axios.patch(
      //   url,
      //   { caption },
      //   { withCredentials: true }
      // );

      const res = await apiClient.patch(`/editPost/${postId}`, { caption });

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to edit the post";
      throw new Error(errorMessage);
    }
  },
  deletePost: async function (postId: string) {
    try {
      // const url = `${postServiceUrl}/deletePost/${postId}`;
      // const res = await axios.delete(url, { withCredentials: true });

      const res = await apiClient.delete(`/deletePost/${postId}`);
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to delete the post";
      throw new Error(errorMessage);
    }
  },

  toggleLike: async function (entity: string, entityId: string) {
    try {
      // const url = `${postServiceUrl}/toggleLike/${entity}/${entityId}`;
      // const res = await axios.patch(url, "", { withCredentials: true });

      const res = await apiClient.patch(
        `/toggleLike/${entity}/${entityId}`,
        ""
      );

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data
          : `Failed to toggle ${entity} like`;
      throw new Error(errorMessage);
    }
  },

  toggleBookmark: async function (postId: string) {
    try {
      // const url = `${postServiceUrl}/toggleBookmark/${postId}`;
      // const res = await axios.patch(url, "", { withCredentials: true });

      const res = await apiClient.patch(`/toggleBookmark/${postId}`, "");
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : `Failed to toggle bookmark`;
      throw new Error(errorMessage);
    }
  },

  //comments

  addComment: async function (comment: string, postId: string) {
    try {
      // const url = `${postServiceUrl}/comment/${postId}`;
      // const res = await axios.post(url, { comment }, { withCredentials: true });

      const res = await apiClient.post(`/comment/${postId}`, { comment });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to comment on the post";
      throw new Error(errorMessage);
    }
  },
  editComment: async function (commentId: string, comment: string) {
    try {
      // const url = `${postServiceUrl}/comment/${commentId}`;
      // const res = await axios.patch(
      //   url,
      //   { comment },
      //   { withCredentials: true }
      // );

      const res = await apiClient.patch(`/comment/${commentId}`, { comment });

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to comment on the post";
      throw new Error(errorMessage);
    }
  },
  deleteComment: async function (commentId: string) {
    try {
      // const url = `${postServiceUrl}/comment/${commentId}`;
      // const res = await axios.delete(url, { withCredentials: true });
console.log(commentId,"commentId//////////////////////////////////////////");

      const res = await apiClient.delete(`/comment/${commentId}`);

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to delete the post";
      throw new Error(errorMessage);
    }
  },

  //reports
  reportEntity: async function (
    entityType: "posts" | "comments" | "users",
    entityId: string,
    reportType: string,
    reportDescription: string
  ) {
    try {
      // const url = `${postServiceUrl}/report/${entityType}/${entityId}`;
      // const res = await axios.post(
      //   url,
      //   { reportType, reportDescription },
      //   { withCredentials: true }
      // );

      const res = await apiClient.post(`/report/${entityType}/${entityId}`, {
        reportType,
        reportDescription,
      });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to report the post";
      throw new Error(errorMessage);
    }
  },

  //reports- admin
  getReportManagementData: async function (
    pageNo: number,
    rowsPerPage: number
  ) {
    try {
      const url = `${postServiceAdminUrl}/reports?pageNo=${pageNo}&rowsPerPage=${rowsPerPage}`;
      const res = await axios.get(url, { withCredentials: true });

      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to get report management data";
      throw new Error(errorMessage);
    }
  },
  deletePostByAdmin: async function (postId: string) {
    try {
      const url = `${postServiceAdminUrl}/deletePost/${postId}`;
      const res = await axios.delete(url, { withCredentials: true });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to delete the post";
      throw new Error(errorMessage);
    }
  },
  resolveReport: async function (reportId: string) {
    try {
      const url = `${postServiceAdminUrl}/reports/${reportId}`;
      const res = await axios.patch(url, {}, { withCredentials: true });
      return res.data;
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to update report management data";
      throw new Error(errorMessage);
    }
  },
};
