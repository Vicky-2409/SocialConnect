import React from "react";
import Image from "next/image";
import { unstable_noStore } from "next/cache";
import getUserData from "@/utils/getUserData";
import NotificationBadge from "./NotificationBadge";
import MessagesBadge from "./MessagesBadge";

async function SideBar() {
  unstable_noStore();

  let userData;
  try {
    const decoded: any = await getUserData();
    userData = decoded.userData;
  } catch (error: any) {
    console.log(error);
    userData = null;
  }

  const profilePicUrl =
    userData?.profilePicUrl || "/img/DefaultProfilePicMale.png";
  const profileLink = userData?.username
    ? `/profile/${userData.username}`
    : "#";

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">
          Failed to load user data. Please try again.
        </p>
      </div>
    );
  }

  const navItems = [
    { href: "/", icon: "/icons/home.svg", label: "Home" },
    {
      href: "/notifications",
      icon: "/icons/notification.svg",
      label: "Notifications",
      notificationbadge: true,
    },
    {
      href: "/messages",
      icon: "/icons/message.svg",
      label: "Messages",
      messagebadge: true,
    },
    {
      href: `/profile/${userData?.username}/bookmarks`,
      icon: "/icons/bookmark.svg",
      label: "Bookmarks",
    },
    { href: "/search", icon: "/icons/search.svg", label: "Search" },
  ];

  const footerItems = [
    {
      href: "/createPost",
      icon: "/icons/createPost.svg",
      label: "Create Post",
    },
    { href: "/settings", icon: "/icons/menu2.svg", label: "More" },
  ];

  return (
    <nav className="flex h-full flex-col bg-white/80 backdrop-blur-md rounded-2xl">
      {/* Profile Section */}
      <a href={profileLink} className="block flex-shrink-0">
        <div className="py-6 px-4 flex flex-col items-center space-y-3">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
            <Image
              src={profilePicUrl}
              alt="Profile Picture"
              width={500}
              height={500}
              className="relative w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full transition duration-300 group-hover:scale-105"
              unoptimized
            />
          </div>
          <p className="text-base font-semibold text-gray-800">
            {userData?.username || "Guest"}
          </p>
        </div>
      </a>

      {/* Navigation Links - Now with flex-grow and overflow-y-auto */}
      <div className="flex-grow overflow-y-auto px-3 py-2">
        <div className="flex flex-col space-y-1">
          {navItems.map(
            ({ href, icon, label, notificationbadge, messagebadge }, index) => (
              <a
                key={index}
                href={href}
                className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-gray-900 transition-all duration-200"
              >
                <div className="relative">
                  {notificationbadge ? (
                    <NotificationBadge>
                      <Image
                        src={icon}
                        alt={`${label} Icon`}
                        width={50}
                        height={50}
                        className="w-6 h-6"
                      />
                    </NotificationBadge>
                  ) : messagebadge ? (
                    <MessagesBadge>
                      <Image
                        src={icon}
                        alt={`${label} Icon`}
                        width={50}
                        height={50}
                        className="w-6 h-6"
                      />
                    </MessagesBadge>
                  ) : (
                    <Image
                      src={icon}
                      alt={`${label} Icon`}
                      width={50}
                      height={50}
                      className="w-6 h-6"
                    />
                  )}
                </div>
                <span className="ml-4 text-sm font-medium">{label}</span>
              </a>
            )
          )}
        </div>
      </div>

      {/* Footer Links - Now relative instead of absolute */}
      <div className="flex-shrink-0 px-3 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-md">
        {footerItems.map(({ href, icon, label }, index) => (
          <a
            key={index}
            href={href}
            className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-gray-900 transition-all duration-200"
          >
            <Image
              src={icon}
              alt={`${label} Icon`}
              width={50}
              height={50}
              className="w-6 h-6"
            />
            <span className="ml-4 text-sm font-medium">{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export default SideBar;
