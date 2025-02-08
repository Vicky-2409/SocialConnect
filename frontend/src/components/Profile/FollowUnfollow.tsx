"use client";
import React, { useEffect, useState } from "react";
import UnFollowAlert from "./UnFollowAlert";
import userService from "@/utils/apiCalls/userService";

type props = {
  userId: string;
  username: string;
  setChanged: React.Dispatch<React.SetStateAction<any>>;
};

function FollowUnfollow(props: props) {
  const { userId, username, setChanged } = props;

  const [isFollowing, setIsFollowing] = useState<boolean | null>(null);

  useEffect(() => {
    (async function (userId) {
      try {
        const isFollowing = await userService.isFollowing(userId);
        setIsFollowing(isFollowing);
      } catch (error: any) {
        alert(error.message);
      }
    })(userId);
  }, [userId]);

  if (isFollowing === null) return null;

  async function toggleFollow() {
    try {
      const isFollowing = await userService.toggleFollow(userId);
      setIsFollowing(isFollowing);
      setChanged((prev: boolean) => !prev);
    } catch (error: any) {
      alert(error.message);
    }
  }

  return (
    <div className="p-4 flex justify-center">
      {isFollowing ? (
        <UnFollowAlert
          alert={`Are you sure you want to unfollow ${username}?`}
          onConfirm={toggleFollow}
        >
          <button
            type="button"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            <span className="text-sm md:text-base">Unfollow</span>
          </button>
        </UnFollowAlert>
      ) : (
        <button
          type="button"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg transform transition duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          onClick={toggleFollow}
        >
          <span className="text-sm md:text-base">Follow</span>
        </button>
      )}
    </div>
  );
}

export default FollowUnfollow;
