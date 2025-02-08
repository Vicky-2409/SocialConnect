"use client";
import React from "react";
import SettingButton from "./SettingButton";
import Image from "next/image";
import { deleteCookie } from "@/utils/deleteCookie";
import { useRouter, useSearchParams } from "next/navigation";
import AlertDialog from "./AlertDialog";
import ChangePassword from "./ChangePassword";
import AccountType from "./AccountType";
import { IUser } from "@/types/types";
import BlockedUsers from "./BlockedUsers";

function SettingsBar({ currUser }: { currUser: IUser }) {
  const settings = [
    ["Change Password", "changePassword"],
    ["Blocked Users", "blockedUsers"],
    ["Account Type", "accountType"],
  ];

  const router = useRouter();
  const searchParams = useSearchParams();
  const settingNameQuery = searchParams.get("settingNameQuery");
  let selected = settingNameQuery;

  function handleLogout() {
    deleteCookie("token");
    router.replace("/");
  }

  if (selected === "changePassword") return <ChangePassword />;
  if (selected === "blockedUsers") return <BlockedUsers />;
  if (selected === "accountType") return <AccountType currUser={currUser} />;

  return (
    <div className="h-full w-full bg-white">
      {/* Header Section */}
      <div className="h-[20%] flex justify-center items-center border-b border-gray-100">
        <h1 className="text-gray-800 font-semibold text-2xl hidden md:block">
          Settings
        </h1>
      </div>

      {/* Settings Menu */}
      <div className="h-[60%] flex flex-col items-start px-6 md:px-[20%] py-6 space-y-4">
        {settings.map((setting, index) => (
          <div key={`settings${index}`} className="w-full">
            <SettingButton settingName={setting[0]} iconName={setting[1]} />
          </div>
        ))}
      </div>

      {/* Logout Section */}
      <div className="h-[20%] flex items-start justify-center px-4">
        <AlertDialog
          onConfirm={handleLogout}
          alert="You really wanna logout of SocialConnect?"
        >
          <button
            className="group relative py-3 px-6 md:w-[35%] bg-red-600 
            hover:bg-red-500 transition-all duration-200 rounded-full 
            flex items-center justify-center gap-3 shadow-sm hover:shadow"
          >
            <Image
              src="/icons/logout.svg"
              width={20}
              height={20}
              alt="Logout"
              className="opacity-90 group-hover:opacity-100"
            />
            <span className="text-white font-medium hidden md:block">
              Logout
            </span>
          </button>
        </AlertDialog>
      </div>
    </div>
  );
}

export default SettingsBar;
