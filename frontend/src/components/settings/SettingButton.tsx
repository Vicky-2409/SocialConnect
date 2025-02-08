"use client";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React from "react";

interface SettingButtonProps {
  settingName: string;
  iconName: string;
}

function SettingButton({ settingName, iconName }: SettingButtonProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const settingNameQuery = searchParams.get("settingNameQuery");
  const selected = !settingNameQuery ? "changePassword" : settingNameQuery;
  const isActive = false;

  return (
    <button
      onClick={() => router.push(`/settings?settingNameQuery=${iconName}`)}
      className={`
        w-full group flex items-center px-4 py-3
        transition-all duration-200 ease-in-out
        hover:bg-gray-100 active:bg-gray-200
        ${
          isActive
            ? "bg-blue-50 text-blue-600 rounded-lg"
            : "text-gray-700 hover:text-gray-900"
        }
      `}
      role="tab"
      aria-selected={isActive}
      aria-controls={`${iconName}-panel`}
    >
      <div
        className={`
        flex items-center justify-center
        transition-transform duration-200
        ${isActive ? "transform scale-105" : "group-hover:scale-105"}
      `}
      >
        <Image
          src={`/icons/${iconName}.svg`}
          height={24}
          width={24}
          alt=""
          className={`
            transition-opacity duration-200
            ${isActive ? "opacity-100" : "opacity-75 group-hover:opacity-100"}
          `}
          aria-hidden="true"
        />
      </div>

      <span
        className={`
        ml-4 text-lg hidden md:block
        transition-all duration-200
        ${isActive ? "font-semibold" : "font-medium group-hover:tracking-wide"}
      `}
      >
        {settingName}
      </span>
    </button>
  );
}

export default SettingButton;
