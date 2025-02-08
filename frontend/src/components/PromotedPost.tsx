"use client";
import Image from "next/image";
import React from "react";
import FeedPostSkeleton from "./feed/FeedPostSkeleton";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/formatString";

type props = {
  postData: any;
};

function PromotedPost({ postData }: props) {
  const router = useRouter();

  if (!postData) return <FeedPostSkeleton />;

  const { _id, userId, caption, imageUrl, createdAt } = postData;

  const { username, firstName, lastName, profilePicUrl } = userId;

  const timestamp = formatDate(createdAt);

  return (
    <a href={`/post/${_id}`}>
      <div className="bg-rootBg mb-2 mt-2 shadow-md rounded-lg">
        <div className="flex justify-evenly py-2">
          <div className="flex items-center">
            <div className="cursor-pointer">
              <Image
                src={profilePicUrl}
                alt="Profile Pic"
                width={300}
                height={300}
                className="w-16 h-16 object-cover rounded-full"
                unoptimized
              />
              <p className="text-white text-sm font-semibold cursor-pointer">
                @{username}
              </p>
            </div>
            <div className="px-4">
              <h3 className="text-white text-xl font-bold cursor-pointer">{`${firstName} ${lastName}`}</h3>
              <div
                className="flex items-center cursor-pointer"
                onClick={() => router.push(`/post/${_id}`)}
              >
                <Image
                  src="/icons/show.svg"
                  alt=""
                  width={150}
                  height={150}
                  className="h-4 w-4"
                />
                <p className="text-white text-xs font-semibold px-2">
                  {timestamp}
                </p>
              </div>
            </div>
          </div>
        </div>
        <p className="font-semibold px-6 py-2 text-white">{caption}</p>
        <div className="relative">
          <Image
            src={imageUrl}
            alt="Tokyo"
            width={1000}
            height={1000}
            className="w-full h-[400px] object-contain mt-4 cursor-pointer"
            unoptimized
          />
        </div>
      </div>
    </a>
  );
}

export default PromotedPost;
