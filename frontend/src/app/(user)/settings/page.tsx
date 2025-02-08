import React from "react";
import SettingsBar from "@/components/settings/SettingsBar";
import getUserData from "@/utils/getUserData";

async function page() {
  let currUser;
  try {
    const { userData } = await getUserData();
    if (!userData) throw new Error("userData Not found");
    currUser = userData;
  } catch (error: any) {
    console.error(error); // Log the error

    return <h1 className="text-black">Loading...</h1>;
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      <div className="flex-1 overflow-hidden">
        <SettingsBar currUser={currUser} />
      </div>
    </div>
  );
}

export default page;
