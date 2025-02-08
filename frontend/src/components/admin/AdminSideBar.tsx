// "use client";
// import { useRouter } from "next/navigation";
// import { deleteCookie } from "@/utils/deleteCookie";
// import {
//   HomeIcon,
//   Users,
//   AlertTriangle,
//   BadgeCheck,
//   Speaker,
//   LogOut,
// } from "lucide-react";

// function AdminSideBar() {
//   const router = useRouter();
//   const pathname = window.location.pathname;

//   function handleLogout() {
//     deleteCookie("adminToken");
//     router.replace("/admin");
//   }

//   const navigationItems = [
//     { href: "/admin/dashboard", icon: HomeIcon, label: "Dashboard" },
//     { href: "/admin/usermanagement", icon: Users, label: "User Management" },
//     { href: "/admin/reportManagement", icon: AlertTriangle, label: "Reports" },
//     {
//       href: "/admin/VerifiedTickManagement",
//       icon: BadgeCheck,
//       label: "Verified Ticks",
//     },
//     { href: "/admin/adsManagement", icon: Speaker, label: "Ads" },
//   ];

//   return (
//     <div
//       className="flex flex-col h-full 
//                     bg-white/80 dark:bg-[#1E2738]/80 
//                     backdrop-blur-xl 
//                     border-r border-gray-200/50 dark:border-gray-800/50 
//                     shadow-lg"
//     >
//       {/* Brand Section */}
//       <div className="p-6">
//         <div
//           className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 
//                         rounded-full flex items-center justify-center 
//                         shadow-md mb-4"
//         >
//           <span className="text-white font-bold text-lg">SC</span>
//         </div>
//         <h2
//           className="text-xl font-bold 
//                        text-gray-800 dark:text-gray-100 
//                        tracking-tight"
//         >
//           SocialConnect
//         </h2>
//       </div>

//       {/* Navigation Links */}
//       <nav className="flex-1 px-4 space-y-2">
//         {navigationItems.map(({ href, icon: Icon, label }) => {
//           const isActive = pathname === href;
//           return (
//             <a
//               key={href}
//               href={href}
//               className={`
//                 flex items-center px-4 py-3 rounded-xl 
//                 transition-all duration-300 group
//                 ${
//                   isActive
//                     ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20"
//                     : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
//                 }
//               `}
//             >
//               <Icon
//                 className={`w-5 h-5 
//                             transition-colors duration-300
//                             ${
//                               isActive
//                                 ? "text-indigo-600"
//                                 : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-500"
//                             }`}
//               />
//               <span
//                 className={`ml-3 font-medium 
//                                 transition-colors duration-300
//                                 ${
//                                   isActive
//                                     ? "text-indigo-600"
//                                     : "group-hover:text-indigo-500"
//                                 }`}
//               >
//                 {label}
//               </span>
//             </a>
//           );
//         })}
//       </nav>

//       {/* Logout Section */}
//       <div className="p-4 border-t border-gray-100 dark:border-gray-700">
//         <button
//           onClick={handleLogout}
//           className="
//             w-full px-4 py-3 rounded-xl
//             bg-gradient-to-r from-red-500 to-red-600
//             hover:from-red-600 hover:to-red-700
//             transition-all duration-300
//             group
//             flex items-center justify-center
//             text-white font-medium
//             shadow-md hover:shadow-lg
//             focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
//           "
//         >
//           <LogOut className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

// export default AdminSideBar;
























"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { deleteCookie } from "@/utils/deleteCookie";
import {
  HomeIcon,
  Users,
  AlertTriangle,
  BadgeCheck,
  Speaker,
  LogOut,
} from "lucide-react";

function AdminSideBar() {
  const router = useRouter();
  const pathname = usePathname(); // Use Next.js navigation hook

  function handleLogout() {
    deleteCookie("adminToken");
    router.replace("/admin");
  }

  const navigationItems = [
    { href: "/admin/dashboard", icon: HomeIcon, label: "Dashboard" },
    { href: "/admin/usermanagement", icon: Users, label: "User Management" },
    { href: "/admin/reportManagement", icon: AlertTriangle, label: "Reports" },
    { href: "/admin/VerifiedTickManagement", icon: BadgeCheck, label: "Verified Ticks" },
    { href: "/admin/adsManagement", icon: Speaker, label: "Ads" },
  ];

  return (
    <div className="flex flex-col h-full bg-white/80 dark:bg-[#1E2738]/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 shadow-lg">
      {/* Brand Section */}
      <div className="p-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-md mb-4">
          <span className="text-white font-bold text-lg">SC</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">SocialConnect</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive ? "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"}
            `}>
              <Icon className={`w-5 h-5 transition-colors duration-300
                ${isActive ? "text-indigo-600" : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-500"}
              `} />
              <span className={`ml-3 font-medium transition-colors duration-300
                ${isActive ? "text-indigo-600" : "group-hover:text-indigo-500"}
              `}>
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300 group flex items-center justify-center text-white font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <LogOut className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AdminSideBar;
