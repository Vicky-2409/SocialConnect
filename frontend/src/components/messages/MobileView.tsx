"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Menu } from "lucide-react";
import SingleConvo from "./SingleConvo";
import ConvoList from "./ConvoList";
import { IUser } from "@/types/types";

const MobileView = ({ currUser }: { currUser: IUser }) => {
  const searchParams = useSearchParams();
  const convoId = searchParams.get("convoId");

  return (
    <div className="h-full w-full bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        {/* Back Button for SingleConvo */}
        {convoId ? (
          <ArrowLeft
            className="h-6 w-6 text-gray-800 cursor-pointer"
            onClick={() => {
              // Navigate back to the ConvoList by clearing the search params
              window.history.replaceState(null, "", "/messages");
            }}
          />
        ) : (
          <Menu className="h-6 w-6 text-gray-800 cursor-pointer" />
        )}
        <span className="text-lg font-semibold text-gray-800">
          {convoId ? "Conversation" : "Messages"}
        </span>
        <div className="w-6" /> {/* Empty div for spacing */}
      </div>

      {/* Conditional Rendering for ConvoList and SingleConvo */}
      {convoId ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <SingleConvo currUser={currUser} showBack={false} />
        </div>
      ) : (
        <div className="flex flex-col flex-1 overflow-auto">
          <ConvoList />
        </div>
      )}
    </div>
  );
};

export default MobileView;
