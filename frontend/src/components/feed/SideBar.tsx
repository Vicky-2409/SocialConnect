// import React from "react";
// import Image from "next/image";
// import { unstable_noStore } from "next/cache";
// import getUserData from "@/utils/getUserData";
// import NotificationBadge from "./NotificationBadge";
// import MessagesBadge from "./MessagesBadge";

// async function SideBar() {
//   unstable_noStore();

// let userData;
// try {
//   const decoded: any = await getUserData();
//   userData = decoded.userData;
// } catch (error: any) {
//   console.log(error);
//   userData = null;
// }

//   const profilePicUrl =
//     userData?.profilePicUrl || "/img/DefaultProfilePicMale.png";
//   const profileLink = userData?.username
//     ? `/profile/${userData.username}`
//     : "#";

//   if (!userData) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p className="text-gray-500">
//           Failed to load user data. Please try again.
//         </p>
//       </div>
//     );
//   }

//   const navItems = [
//     { href: "/", icon: "/icons/home.svg", label: "Home" },
//     {
//       href: "/notifications",
//       icon: "/icons/notification.svg",
//       label: "Notifications",
//       notificationbadge: true,
//     },
//     {
//       href: "/messages",
//       icon: "/icons/message.svg",
//       label: "Messages",
//       messagebadge: true,
//     },
//     {
//       href: `/profile/${userData?.username}/bookmarks`,
//       icon: "/icons/bookmark.svg",
//       label: "Bookmarks",
//     },
//     { href: "/search", icon: "/icons/search.svg", label: "Search" },
//   ];

//   const footerItems = [
//     {
//       href: "/createPost",
//       icon: "/icons/createPost.svg",
//       label: "Create Post",
//     },
//     { href: "/settings", icon: "/icons/menu2.svg", label: "More" },
//   ];

//   return (
//     <nav className="flex h-full flex-col bg-white/80 backdrop-blur-md rounded-2xl">
//       {/* Profile Section */}
//       <a href={profileLink} className="block flex-shrink-0">
//         <div className="py-6 px-4 flex flex-col items-center space-y-3">
//           <div className="relative group">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
//             <Image
//               src={profilePicUrl}
//               alt="Profile Picture"
//               width={500}
//               height={500}
//               className="relative w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full transition duration-300 group-hover:scale-105"
//               unoptimized
//             />
//           </div>
//           <p className="text-base font-semibold text-gray-800">
//             {userData?.username || "Guest"}
//           </p>
//         </div>
//       </a>

//       {/* Navigation Links - Now with flex-grow and overflow-y-auto */}
//       <div className="flex-grow overflow-y-auto px-3 py-2">
//         <div className="flex flex-col space-y-1">
//           {navItems.map(
//             ({ href, icon, label, notificationbadge, messagebadge }, index) => (
//               <a
//                 key={index}
//                 href={href}
//                 className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-gray-900 transition-all duration-200"
//               >
//                 <div className="relative">
//                   {notificationbadge ? (
//                     <NotificationBadge>
//                       <Image
//                         src={icon}
//                         alt={`${label} Icon`}
//                         width={50}
//                         height={50}
//                         className="w-6 h-6"
//                       />
//                     </NotificationBadge>
//                   ) : messagebadge ? (
//                     <MessagesBadge>
//                       <Image
//                         src={icon}
//                         alt={`${label} Icon`}
//                         width={50}
//                         height={50}
//                         className="w-6 h-6"
//                       />
//                     </MessagesBadge>
//                   ) : (
//                     <Image
//                       src={icon}
//                       alt={`${label} Icon`}
//                       width={50}
//                       height={50}
//                       className="w-6 h-6"
//                     />
//                   )}
//                 </div>
//                 <span className="ml-4 text-sm font-medium">{label}</span>
//               </a>
//             )
//           )}
//         </div>
//       </div>

//       {/* Footer Links - Now relative instead of absolute */}
//       <div className="flex-shrink-0 px-3 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-md">
//         {footerItems.map(({ href, icon, label }, index) => (
//           <a
//             key={index}
//             href={href}
//             className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-gray-900 transition-all duration-200"
//           >
//             <Image
//               src={icon}
//               alt={`${label} Icon`}
//               width={50}
//               height={50}
//               className="w-6 h-6"
//             />
//             <span className="ml-4 text-sm font-medium">{label}</span>
//           </a>
//         ))}
//       </div>
//     </nav>
//   );
// }

// export default SideBar;

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import getUserData from "@/utils/getUserData";
// import NotificationBadge from "./NotificationBadge";
// import MessagesBadge from "./MessagesBadge";

// async function SideBar() {
//   let userData;
//   try {
//     const decoded: any = await getUserData();
//     userData = decoded.userData;
//   } catch (error: any) {
//     console.log(error);
//     userData = null;
//   }

//   const profilePicUrl = userData?.profilePicUrl || "/img/DefaultProfilePicMale.png";
//   const profileLink = userData?.username ? `/profile/${userData.username}` : "#";

//   const navItems = [
//     { href: "/", icon: "/icons/home.svg", label: "Home" },
//     { href: "/notifications", icon: "/icons/notification.svg", label: "Notifications", notificationbadge: true },
//     { href: "/messages", icon: "/icons/message.svg", label: "Messages", messagebadge: true },
//     { href: `/profile/${userData.username}/bookmarks`, icon: "/icons/bookmark.svg", label: "Bookmarks" },
//     { href: "/search", icon: "/icons/search.svg", label: "Search" },
//   ];

//   const footerItems = [
//     { href: "/createPost", icon: "/icons/createPost.svg", label: "Create Post" },
//     { href: "/settings", icon: "/icons/menu2.svg", label: "More" },
//   ];

//   return (
//     <nav className="flex h-full flex-col bg-white/80 backdrop-blur-md rounded-2xl">
//       {/* Profile Section */}
//       <Link href={profileLink} className="block flex-shrink-0">
//         <div className="py-6 px-4 flex flex-col items-center space-y-3">
//           <div className="relative group">
//             <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
//             <Image
//               src={profilePicUrl}
//               alt="Profile Picture"
//               width={500}
//               height={500}
//               className="relative w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full transition duration-300 group-hover:scale-105"
//               unoptimized
//             />
//           </div>
//           <p className="text-base font-semibold text-gray-800">{userData?.username || "Guest"}</p>
//         </div>
//       </Link>

//       {/* Navigation Links */}
//       <div className="flex-grow overflow-y-auto px-3 py-2">
//         <div className="flex flex-col space-y-1">
//           {navItems.map(({ href, icon, label, notificationbadge, messagebadge }) => (
//             <Link
//               key={href}
//               href={href}
//               className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-gray-900 transition-all duration-200"
//             >
//               <div className="relative">
//                 {notificationbadge ? (
//                   <NotificationBadge>
//                     <Image src={icon} alt={`${label} Icon`} width={50} height={50} className="w-6 h-6" />
//                   </NotificationBadge>
//                 ) : messagebadge ? (
//                   <MessagesBadge>
//                     <Image src={icon} alt={`${label} Icon`} width={50} height={50} className="w-6 h-6" />
//                   </MessagesBadge>
//                 ) : (
//                   <Image src={icon} alt={`${label} Icon`} width={50} height={50} className="w-6 h-6" />
//                 )}
//               </div>
//               <span className="ml-4 text-sm font-medium">{label}</span>
//             </Link>
//           ))}
//         </div>
//       </div>

//       {/* Footer Links */}
//       <div className="flex-shrink-0 px-3 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-md">
//         {footerItems.map(({ href, icon, label }) => (
//           <Link
//             key={href}
//             href={href}
//             className="flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-gray-900 transition-all duration-200"
//           >
//             <Image src={icon} alt={`${label} Icon`} width={50} height={50} className="w-6 h-6" />
//             <span className="ml-4 text-sm font-medium">{label}</span>
//           </Link>
//         ))}
//       </div>
//     </nav>
//   );
// }

// export default SideBar;

// import React from 'react';
// import Image from 'next/image';
// import Link from 'next/link';
// import { Home, Bell, MessageSquare, Bookmark, Search, PenSquare, Settings, User } from 'lucide-react';
// import getUserData from '@/utils/getUserData';

// const SideBar = async () => {
//   let userData;
//   try {
//     const decoded: any = await getUserData();
//     userData = decoded.userData;
//   } catch (error: any) {
//     console.log(error);
//     userData = null;
//   }

//   const profilePicUrl = userData?.profilePicUrl || "/img/DefaultProfilePicMale.png";
//   const profileLink = userData?.username ? `/profile/${userData.username}` : "#";

//   const navItems = [
//     { href: "/", Icon: Home, label: "Home" },
//     { href: "/notifications", Icon: Bell, label: "Notifications", notificationbadge: true },
//     { href: "/messages", Icon: MessageSquare, label: "Messages", messagebadge: true },
//     { href: `/profile/${userData?.username}/bookmarks`, Icon: Bookmark, label: "Bookmarks" },
//     { href: "/search", Icon: Search, label: "Search" },
//   ];

//   const footerItems = [
//     { href: "/createPost", Icon: PenSquare, label: "Create Post" },
//     { href: "/settings", Icon: Settings, label: "More" },
//   ];

//   const NotificationBadge = ({ children }: { children: React.ReactNode }) => (
//     <div className="relative">
//       {children}
//       <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
//         <span className="text-white text-xs font-bold">•</span>
//       </span>
//     </div>
//   );

//   const MessagesBadge = ({ children }: { children: React.ReactNode }) => (
//     <div className="relative">
//       {children}
//       <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
//         <span className="text-white text-xs font-bold">•</span>
//       </span>
//     </div>
//   );

//   return (
//     <nav className="flex h-full flex-col bg-white border-r border-gray-100">
//       {/* Profile Section */}
//       <Link href={profileLink} className="block flex-shrink-0">
//         <div className="py-8 px-6 flex flex-col items-center space-y-4">
//           <div className="relative group cursor-pointer">
//             <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md" />
//             <div className="relative">
//               <Image
//                 src={profilePicUrl}
//                 alt="Profile"
//                 width={56}
//                 height={56}
//                 className="rounded-full object-cover ring-2 ring-white"
//                 unoptimized
//               />
//             </div>
//           </div>
//           <p className="text-sm font-medium text-gray-900">{userData?.username || "Guest"}</p>
//         </div>
//       </Link>

//       {/* Navigation */}
//       <div className="flex-grow px-4 py-2 space-y-1">
//         {navItems.map(({ href, Icon, label, notificationbadge, messagebadge }) => (
//           <Link
//             key={href}
//             href={href}
//             className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
//           >
//             {notificationbadge ? (
//               <NotificationBadge>
//                 <Icon className="w-5 h-5" />
//               </NotificationBadge>
//             ) : messagebadge ? (
//               <MessagesBadge>
//                 <Icon className="w-5 h-5" />
//               </MessagesBadge>
//             ) : (
//               <Icon className="w-5 h-5" />
//             )}
//             <span className="ml-3 text-sm font-medium">{label}</span>
//           </Link>
//         ))}
//       </div>

//       {/* Footer */}
//       <div className="flex-shrink-0 px-4 py-6 border-t border-gray-100">
//         {footerItems.map(({ href, Icon, label }) => (
//           <Link
//             key={href}
//             href={href}
//             className="flex items-center px-4 py-3 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200"
//           >
//             <Icon className="w-5 h-5" />
//             <span className="ml-3 text-sm font-medium">{label}</span>
//           </Link>
//         ))}
//       </div>
//     </nav>
//   );
// };

// export default SideBar;

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Home,
  Bell,
  MessageSquare,
  Bookmark,
  Search,
  PenSquare,
  Settings,
  Check,
} from "lucide-react";
import getUserData from "@/utils/getUserData";
import NotificationBadge from "./NotificationBadge";
import MessagesBadge from "./MessagesBadge";




const SideBar = async () => {
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
  const isVerified = userData?.accountType?.hasWeNetTick;

  const navItems = [
    { href: "/", Icon: Home, label: "Home" },
    {
      href: "/notifications",
      Icon: Bell,
      label: "Notifications",
      notificationbadge: true,
    },
    {
      href: "/messages",
      Icon: MessageSquare,
      label: "Messages",
      messagebadge: true,
    },
    {
      href: `/profile/${userData?.username}/bookmarks`,
      Icon: Bookmark,
      label: "Bookmarks",
    },
    { href: "/search", Icon: Search, label: "Search" },
  ];

  const footerItems = [
    { href: "/settings", Icon: Settings, label: "Settings" },
  ];

 
  
  

  return (
    <nav className="flex h-80 w-64 flex-col border-gray-200">
      {/* Profile Section */}
      <Link href={profileLink} className="block flex-shrink-0">
        <div className="p-4 flex flex-col items-center gap-4">
          <div className="relative">
            <Image
              src={profilePicUrl}
              alt="Profile"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-200"
              unoptimized
            />
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
            {/* <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div> */}
          </div>
          <div className="flex flex-col items-center">
            <span className="font-semibold text-lg">
              {userData?.username || "Guest"}
            </span>
            <span className="text-gray-500 text-sm">
              @{userData?.username || "guest"}
            </span>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 mt-6">
        {navItems.map(
          ({ href, Icon, label, notificationbadge, messagebadge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {notificationbadge ? (
                <NotificationBadge>
                  <Icon size={24} className="min-w-6" />
                </NotificationBadge>
              ) : messagebadge ? (
                <MessagesBadge>
                  <Icon size={24} className="min-w-6" />
                </MessagesBadge>
              ) : (
                <Icon size={24} className="min-w-6" />
              )}
              <span className="text-sm font-medium">{label}</span>
            </Link>
          )
        )}
      </nav>

      {/* Create Post Button */}
      <div className="p-4">
        <Link
          href="/createPost"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors"
        >
          <PenSquare size={20} />
          <span className="font-medium">Create Post</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        {footerItems.map(({ href, Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Icon size={24} className="min-w-6" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default SideBar;

// import React from 'react';
// import { Home, Bell, MessageSquare, Bookmark, Search, PenSquare, Settings, Menu } from 'lucide-react';

// const Sidebar = () => {
//   const [isCollapsed, setIsCollapsed] = React.useState(false);

//   const menuItems = [
//     { icon: Home, label: 'Home' },
//     { icon: Bell, label: 'Notifications' },
//     { icon: MessageSquare, label: 'Messages' },
//     { icon: Bookmark, label: 'Bookmarks' },
//     { icon: Search, label: 'Search' },
//     { icon: Settings, label: 'Settings' }
//   ];

//   return (
//     <div className={`flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
//       {/* Mobile Toggle */}
//       <button
//         className="lg:hidden p-4 hover:bg-gray-100 rounded-full m-2"
//         onClick={() => setIsCollapsed(!isCollapsed)}
//       >
//         <Menu size={24} />
//       </button>

//       {/* Profile Section */}
//       <div className={`p-4 flex flex-col items-center ${isCollapsed ? '' : 'gap-4'}`}>
//         <div className="relative">
//           <img
//             src="/api/placeholder/40/40"
//             alt="Profile"
//             className={`rounded-full object-cover border-2 border-gray-200 transition-all duration-300 ${
//               isCollapsed ? 'w-10 h-10' : 'w-32 h-32'
//             }`}
//           />
//           <div className={`absolute bottom-0 right-0 bg-green-500 rounded-full border-2 border-white transition-all duration-300 ${
//             isCollapsed ? 'w-3 h-3' : 'w-5 h-5'
//           }`}></div>
//         </div>
//         {!isCollapsed && (
//           <div className="flex flex-col items-center">
//             <span className="font-semibold text-lg">John Doe</span>
//             <span className="text-gray-500 text-sm">@johndoe</span>
//           </div>
//         )}
//       </div>

//       {/* Navigation Menu */}
//       <nav className="flex-1 mt-6">
//         {menuItems.map((item) => (
//           <button
//             key={item.label}
//             className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors"
//           >
//             <item.icon size={24} className="min-w-6" />
//             {!isCollapsed && (
//               <span className="text-sm font-medium">{item.label}</span>
//             )}
//           </button>
//         ))}
//       </nav>

//       {/* Create Post Button */}
//       <div className="p-4">
//         <button className={`flex items-center justify-center transition-all duration-300 bg-blue-500 hover:bg-blue-600 text-white rounded-full ${
//           isCollapsed ? 'w-10 h-10' : 'w-full py-3 px-4 gap-2'
//         }`}>
//           <PenSquare size={20} />
//           {!isCollapsed && <span className="font-medium">Create Post</span>}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;
