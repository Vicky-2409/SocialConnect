"use client";
import React, { useEffect, useState } from "react";
import ConvoListSingle from "./ConvoListSingle";
import messageService from "@/utils/apiCalls/messageService";

function ConvoList() {
  const [convoList, setConvoList] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Set loading state

  useEffect(() => {
    (async function () {
      try {
        const convoList = await messageService.getConvoList();
        setConvoList(convoList);
      } catch (error: any) {
        alert(error.message);
      } finally {
        setIsLoading(false); // Stop loading after data is fetched
      }
    })();
  }, []);

  return (
    <>
      <div className="h-[10%] w-full flex bg-white shadow-md">
        <h1 className="h-full w-full flex items-center justify-center font-bold text-xl text-gray-800">
          Conversations
        </h1>
      </div>
      <div className="h-full overflow-y-auto bg-gray-50 no-scrollbar">
        {isLoading ? (
          // Show a simple loading indicator while loading
          <div className="flex justify-center items-center h-full ">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
          </div>
        ) : convoList.length > 0 ? (
          convoList.map((convo) => {
            const {
              convoId,
              username,
              firstName,
              lastName,
              profilePicUrl,
              timestamp,
              lastMessage,
              unreadCount,
            } = convo;

            return (
              <ConvoListSingle
                key={convoId}
                convoId={convoId}
                username={username}
                firstName={firstName}
                lastName={lastName}
                profilePicUrl={profilePicUrl}
                lastMessage={lastMessage}
                timestamp={timestamp}
                unreadCount={unreadCount}
              />
            );
          })
        ) : (
          <div className="flex justify-center items-center h-full text-gray-700 text-lg">
            <h1>No Conversations</h1>
          </div>
        )}
      </div>
    </>
  );
}

export default ConvoList;
