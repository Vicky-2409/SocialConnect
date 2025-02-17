"use client";
import { IUser } from "@/types/types";
import userService from "@/utils/apiCalls/userService";
import messageService from "@/utils/apiCalls/messageService";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MapPin, Calendar, MessageCircle, Shield } from "lucide-react";
import ProfileHeaderLoading from "./ProfileHeaderLoading";
import FollowUnfollow from "./FollowUnfollow";
import ProfileHeaderBottom from "./ProfileHeaderBottom";
import BlockAlert from "./BlockAlert";
import { toast } from "react-toastify";
import { BlockedOverlay } from "./BlockedOverlay";

import { Avatar, styled } from "@mui/material";

function ProfileHeader({ currUser }: { currUser: IUser }) {
  const currUserId = currUser._id;
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const paramsUsername = params.username;

  const [userData, setUserData] = useState<IUser | null>(null);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getProfileData(paramsUsername);
        setUserData(userData);

        const { _id } = userData;
        if (_id != currUserId) {
          const isBlocked = await userService.isBlocked(_id);
          setIsBlocked(isBlocked);
        }
      } catch (error: any) {
        toast.error(error.message);
      }
    };

    if (paramsUsername) {
      fetchUserData();
    }
  }, [paramsUsername, changed, currUserId]);

  if (!userData) return <ProfileHeaderLoading />;

  const { _id, firstName, lastName, username, accountType } = userData;
  let { dateOfBirth, bio, profilePicUrl, coverPicUrl, location } = userData;

  const dateOfBirthToDisplay = dateOfBirth
    ? new Date(String(dateOfBirth)).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not specified";

  const isOwnProfile = _id === currUserId;
  const isVerified = accountType?.hasWeNetTick;

  if (!bio) bio = "";
  if (!profilePicUrl) profilePicUrl = "/img/DefaultProfilePicMale.png";
  if (!coverPicUrl) coverPicUrl = "";

  async function handleSendMessage() {
    try {
      const convoData = await messageService.createConversation(_id);
      router.push(`/messages?convoId=${convoData._id}&username=${username}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  async function handleBlock() {
    try {
      await toast.promise(userService.blockUser(_id), {
        pending: "Processing...",
        success: "Action completed successfully",
        error: "Operation failed",
      });
      setChanged((prev) => !prev);
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: 160,
    height: 160,
    border: `4px solid ${theme.palette.background.paper}`,
    boxShadow: theme.shadows[3],
  }));

  return (
    <>
      {isBlocked && <BlockedOverlay />}
      <div className="relative bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="h-64 md:h-64 lg:h-64 relative bg-gradient-to-r from-blue-50 to-indigo-50">
          {coverPicUrl && (
            <Image
              src={coverPicUrl}
              alt="Cover"
              width={1200}
              height={400}
              className="w-full h-full object-cover"
              unoptimized
            />
          )}
        </div>

        {/* Profile Content */}
        <div className="relative px-4 pb-6 -mt-24 md:-mt-32">
          {/* Profile Picture */}
          <div className="relative inline-block">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full ring-4 ring-white overflow-hidden">
              <Image
                src={profilePicUrl}
                alt={`${firstName}'s profile`}
                width={160}
                height={160}
                className="w-full h-full object-cover transition duration-200 hover:scale-105"
                unoptimized
              />

              {/* <StyledAvatar src={profilePicUrl} alt={firstName} /> */}
            </div>
            {isVerified && (
              <div className="absolute bottom-2 right-2 bg-white rounded-full p-1">
                <Image
                  src="/icons/Verified-tick.png"
                  alt="Verified"
                  height={24}
                  width={24}
                  unoptimized
                />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {`${firstName} ${lastName}`}
              </h1>
              <p className="text-gray-600">@{username}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isOwnProfile ? (
                <a href={`/profile/${username}/edit`}>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Edit Profile
                  </button>
                </a>
              ) : (
                <div className="flex items-center gap-3">
                  <FollowUnfollow
                    userId={_id}
                    username={username}
                    setChanged={setChanged}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <MessageCircle size={24} />
                  </button>
                  <BlockAlert alert="Block this user?" onConfirm={handleBlock}>
                    <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200">
                      <Shield size={24} />
                    </button>
                  </BlockAlert>
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          {bio && <p className="mt-4 text-gray-700 max-w-2xl">{bio}</p>}

          {/* User Details */}
          <div className="mt-6 flex flex-wrap gap-4 text-gray-600">
            {location && (
              <div className="flex items-center gap-1">
                <MapPin size={18} />
                <span>{location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar size={18} />
              <span>Birthday {dateOfBirthToDisplay}</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 border-t border-gray-100">
          <ProfileHeaderBottom userData={userData} currentUser={currUser} />
        </div>
      </div>
    </>
  );
}

export default ProfileHeader;
