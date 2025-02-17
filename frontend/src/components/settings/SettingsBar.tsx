// "use client";
// import React from "react";
// import SettingButton from "./SettingButton";
// import Image from "next/image";
// import { deleteCookie } from "@/utils/deleteCookie";
// import { useRouter, useSearchParams } from "next/navigation";
// import AlertDialog from "./AlertDialog";
// import ChangePassword from "./ChangePassword";
// import AccountType from "./AccountType";
// import { IUser } from "@/types/types";
// import BlockedUsers from "./BlockedUsers";

// function SettingsBar({ currUser }: { currUser: IUser }) {
//   const settings = [
//     ["Change Password", "changePassword"],
//     ["Blocked Users", "blockedUsers"],
//     ["Account Type", "accountType"],
//   ];

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const settingNameQuery = searchParams.get("settingNameQuery");
//   let selected = settingNameQuery;

//   function handleLogout() {
//     deleteCookie("token");
//     router.replace("/");
//   }

//   if (selected === "changePassword") return <ChangePassword />;
//   if (selected === "blockedUsers") return <BlockedUsers />;
//   if (selected === "accountType") return <AccountType currUser={currUser} />;

//   return (
//     <div className="h-full w-full bg-white">
//       {/* Header Section */}
//       <div className="h-[20%] flex justify-center items-center border-b border-gray-100">
//         <h1 className="text-gray-800 font-semibold text-2xl hidden md:block">
//           Settings
//         </h1>
//       </div>

//       {/* Settings Menu */}
//       <div className="h-[60%] flex flex-col items-start px-6 md:px-[20%] py-6 space-y-4">
//         {settings.map((setting, index) => (
//           <div key={`settings${index}`} className="w-full">
//             <SettingButton settingName={setting[0]} iconName={setting[1]} />
//           </div>
//         ))}
//       </div>

//       {/* Logout Section */}
//       <div className="h-[20%] flex items-start justify-center px-4">
//         <AlertDialog
//           onConfirm={handleLogout}
//           alert="You really wanna logout of SocialConnect?"
//         >
//           <button
//             className="group relative py-3 px-6 md:w-[35%] bg-red-600 
//             hover:bg-red-500 transition-all duration-200 rounded-full 
//             flex items-center justify-center gap-3 shadow-sm hover:shadow"
//           >
//             <Image
//               src="/icons/logout.svg"
//               width={20}
//               height={20}
//               alt="Logout"
//               className="opacity-90 group-hover:opacity-100"
//             />
//             <span className="text-white font-medium hidden md:block">
//               Logout
//             </span>
//           </button>
//         </AlertDialog>
//       </div>
//     </div>
//   );
// }

// export default SettingsBar;





























"use client";
import React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { deleteCookie } from "@/utils/deleteCookie";
import AlertDialog from "./AlertDialog";
import ChangePassword from "./ChangePassword";
import AccountType from "./AccountType";
import BlockedUsers from "./BlockedUsers";
import { IUser } from "@/types/types";
import { Settings, Lock, UserX, UserCog, LogOut } from "lucide-react";

function SettingsBar({ currUser }: { currUser: IUser }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const settingNameQuery = searchParams.get("settingNameQuery");

  const settings = [
    {
      name: "Change Password",
      query: "changePassword",
      icon: <Lock className="w-5 h-5" />,
      description: "Update your account password"
    },
    {
      name: "Blocked Users",
      query: "blockedUsers",
      icon: <UserX className="w-5 h-5" />,
      description: "Manage blocked accounts"
    },
    {
      name: "Account Type",
      query: "accountType",
      icon: <UserCog className="w-5 h-5" />,
      description: "Change your account type"
    }
  ];

  const handleLogout = () => {
    deleteCookie("token");
    router.replace("/");
  };

  // Render specific settings pages
  if (settingNameQuery === "changePassword") return <ChangePassword />;
  if (settingNameQuery === "blockedUsers") return <BlockedUsers />;
  if (settingNameQuery === "accountType") return <AccountType currUser={currUser} />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-600">Manage your account preferences and settings</p>
      </div>

      {/* Settings Grid */}
      <div className="grid gap-4 mb-8">
        {settings.map((setting) => (
          <button
            key={setting.query}
            onClick={() => router.push(`/settings?settingNameQuery=${setting.query}`)}
            className="w-full p-4 text-left bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
          >
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                {setting.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{setting.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{setting.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <div className="flex justify-center">
        <AlertDialog
          onConfirm={handleLogout}
          alert="Are you sure you want to logout of SocialConnect?"
        >
          <button className="group flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </AlertDialog>
      </div>
    </div>
  );
}

export default SettingsBar;