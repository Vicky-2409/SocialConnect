import React from "react";
import MobileView from "@/components/messages/MobileView";
import getUserData from "@/utils/getUserData";
import { Loader2 } from "lucide-react";

export default async function MessagesPage() {
  let currUser;

  // Fetching user data
  try {
    const { userData } = await getUserData();
    if (!userData) throw new Error("User data not found");
    currUser = userData;
  } catch (error: any) {
    console.log(error);

    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="p-4 text-gray-600">
          <Loader2 className="animate-spin text-blue-500 h-8 w-8" />
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col">
      {/* Mobile View - Visible on mobile and desktop */}
      <div className="flex-1 overflow-hidden">
        <MobileView currUser={currUser} />
      </div>
    </div>
  );
}
