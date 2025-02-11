"use client";
import React, { useEffect, useState } from "react";
import FeedPostSkeleton from "../../feed/FeedPostSkeleton";
import FeedPost from "../../feed/FeedPost";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import postService from "@/utils/apiCalls/postService";
import { useDispatch } from "react-redux";
import { storePostData } from "@/redux/postSlice";
import { IPost, IUser } from "@/types/types";
import { toastOptions } from "@/utils/toastOptions";

function Post({ currUserData }: { currUserData: IUser }) {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch();

  const [postData, setPostData] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function (id: string) {
      try {
        const postData = await postService.getSinglePostData(id);      
        console.log(postData,"postData/////////////////////////////////////////////////////////////////////////////////////");
          
        setPostData(postData);
        dispatch(storePostData({ postData }));
        setLoading(false);
      } catch (error: any) {
        toast.error("error", toastOptions);
      }
    })(id);
  }, [id, dispatch]);

  if(postData && postData.isDeleted){

    //need to handel deleted post here
    return <h1>The Post is Deleted</h1>
  }

  return (
    <>

      {loading ? (
        <FeedPostSkeleton />
      ) : (
        <FeedPost postData={postData} currUserData={currUserData} />
      )}
    </>
  );
}

export default Post;
