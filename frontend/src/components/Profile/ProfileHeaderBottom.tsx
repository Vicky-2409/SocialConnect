"use client";
import React, { useEffect, useState } from "react";
import { IPost, IUser } from "@/types/types";
import userService from "@/utils/apiCalls/userService";
import { ToastContainer, toast } from "react-toastify";
import { X, Users, UserMinus, UserCheck } from "lucide-react";
import Image from "next/image";
import "react-toastify/dist/ReactToastify.css";
import postService from "@/utils/apiCalls/postService";

function ProfileHeaderBottom({
  userData,
  currentUser,
}: {
  userData: IUser;
  currentUser: IUser;
}) {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [followers, setFollowers] = useState(userData?.followers || []);
  const [following, setFollowing] = useState(userData?.following || []);
  const [postData, setPostData] = useState<IPost[] | null>(null);

  if (userData) {
    useEffect(() => {
      const fetchPosts = async () => {
        const posts = await postService.getProfileFeed(userData.username);
        setPostData(posts);
        setFollowers(userData?.followers || []);
        setFollowing(userData?.following || []);
      };

      fetchPosts();
    }, [userData]);
  }

  const handleUnfollow = async (userId: string) => {
    try {
      const isUnfollowed = await userService.toggleFollow(userId);
      if (!isUnfollowed) {
        setFollowing((prev) => prev.filter((user) => user._id !== userId));
        toast.success("Unfollowed successfully", {
          icon: <span>👋</span>,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to unfollow");
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      const isRemoved = await userService.toggleRemove(userId);
      if (isRemoved) {
        setFollowers((prev) => prev.filter((user) => user._id !== userId));
        toast.success("Follower removed", {
          icon: <span>✅</span>,
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to remove follower");
    }
  };

  type StatCardProps = {
    count: number | string;
    label: string;
    onClick?: () => void;
  };

  const StatCard: React.FC<StatCardProps> = ({ count, label, onClick }) => (
    <div
      onClick={onClick}
      className="group flex-1 px-6 py-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 rounded-xl"
    >
      <div className="flex flex-col items-center space-y-1">
        <span className="text-3xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {count}
        </span>
        <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">
          {label}
        </span>
      </div>
    </div>
  );

  type UserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    users: any[];
    actionType: string;
  };

  const UserModal: React.FC<UserModalProps> = ({
    isOpen,
    onClose,
    title,
    users,
    actionType,
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

          <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-gray-600" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    {title}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-1 text-gray-400 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {users.length > 0 ? (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12">
                            <Image
                              src={user.profilePicUrl || "/default-avatar.png"}
                              alt={user.username}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {user.username}
                            </span>
                            <span className="text-sm text-gray-500">
                              {`${user.firstName} ${user.lastName}`}
                            </span>
                          </div>
                        </div>
                        {currentUser._id === userData._id && (
                          <button
                            onClick={() =>
                              actionType === "unfollow"
                                ? handleUnfollow(user._id)
                                : handleRemove(user._id)
                            }
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            {actionType === "unfollow" ? (
                              <>
                                <UserMinus className="w-4 h-4" />
                                <span>Unfollow</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="w-4 h-4" />
                                <span>Remove</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No users yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="border-t border-gray-100 bg-white rounded-b-xl">
      <ToastContainer
        position="bottom-right"
        theme="light"
        hideProgressBar={false}
      />

      {/* Stats Section */}
      <div className="flex justify-center gap-6 py-4">
        <StatCard count={postData?.length || 0} label="Posts" />
        <StatCard
          count={following.length}
          label="Following"
          onClick={() => setShowFollowing(true)}
        />
        <StatCard
          count={followers.length}
          label="Followers"
          onClick={() => setShowFollowers(true)}
        />
      </div>

      {/* Modals */}
      <UserModal
        isOpen={showFollowing}
        onClose={() => setShowFollowing(false)}
        title="Following"
        users={following}
        actionType="unfollow"
      />

      <UserModal
        isOpen={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="Followers"
        users={followers}
        actionType="remove"
      />
    </div>
  );
}

export default ProfileHeaderBottom;
