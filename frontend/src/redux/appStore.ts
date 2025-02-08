"use client";
import { Middleware, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import postReducer from "./postSlice";
import socketReducer from "./socketSlice";
import userSocketReducer from "./userSocketSlice";
import notificationSocketReducer from "./notificationSocketSlice";

export default configureStore({
  reducer: {
    user: userReducer,
    post: postReducer,
    socket: socketReducer,
    userSocket: userSocketReducer,
    notificationSocket: notificationSocketReducer,
  },
});
