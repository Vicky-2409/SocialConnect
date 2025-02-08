import React from "react";
import Post from "./Post";
import getUserData from "@/utils/getUserData";
import AddCommentForm from "./AddCommentForm";

async function SinglePost() {
  let userData;
  try {
    const decoded: any = await getUserData();
    userData = decoded.userData;
  } catch (error: any) {
    console.log(error);
  }

  return (
    <>
      <Post currUserData={userData} />
      <AddCommentForm userData={userData} userId={userData?._id} />
    </>
  );
}

export default SinglePost;
