import React from "react";
import {
  Home,
  Bell,
  MessageSquare,
  Search,
  PlusCircle,
  Settings,
} from "lucide-react";
import Link from "next/link";
import getUserData from "@/utils/getUserData";
import { unstable_noStore } from "next/cache";

const BottomNav = async ({ pathname = "/" }) => {
  unstable_noStore();

  let userData;
  try {
    const decoded: any = await getUserData();
    userData = decoded.userData;
  } catch (error: any) {
    console.log(error);
  }

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/notifications", icon: Bell, label: "Alerts" },
    { href: "/messages", icon: MessageSquare, label: "Chat" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/createPost", icon: PlusCircle, label: "Create" },
    { href: "/settings", icon: Settings, label: "Settings" }, // Added Settings option
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white backdrop-blur-lg bg-opacity-90 py-2 px-3 flex justify-around items-center border-t border-gray-200 md:hidden z-50">
      {navItems.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "relative flex flex-col items-center min-w-[3rem] px-2 py-1 rounded-xl transition-all duration-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            }
          >
            <Icon
              size={20}
              className={"transition-all duration-200 stroke-1.5"}
            />
            <span
              className={
                "text-[10px] mt-1 font-medium transition-all duration-200 opacity-70"
              }
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default BottomNav;
