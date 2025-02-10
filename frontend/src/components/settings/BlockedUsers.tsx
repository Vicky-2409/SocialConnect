"use client";
import userService from "@/utils/apiCalls/userService";
import { toastOptions } from "@/utils/toastOptions";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AlertDialog from "./AlertDialog";

function BlockedUsers() {
  const [blockedUsersData, setBlockedUsersData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentCount, setDocumentCount] = useState(0);
  const [rowsPerPage] = useState(5);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    async function fetchBlockedUsers() {
      try {
        const [responseFormat, documentCount] =
          await userService.getBlockedUsers(currentPage, rowsPerPage);
        setBlockedUsersData(responseFormat);
        setDocumentCount(documentCount);
      } catch (error: any) {
        toast.error(error.message, toastOptions);
      }
    }
    fetchBlockedUsers();
  }, [currentPage, rowsPerPage, changed]);

  async function unblock(userId: string) {
    try {
      await toast.promise(
        userService.blockUser(userId),
        {
          pending: "Unblocking user",
          success: "User unblocked successfully",
          error: "Failed to block user",
        },
        toastOptions
      );
      setChanged((prev) => !prev);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    }
  }

  const totalPages = Math.ceil(documentCount / rowsPerPage);

  if (blockedUsersData.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white">
        <div className="h-24 w-full flex justify-center items-center border-b border-gray-100">
          <h1 className="text-gray-800 font-semibold text-2xl">
            Blocked Users
          </h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center space-y-6 p-8">
          <Image
            src="/icons/noUsersBlocked.png"
            alt="No users blocked"
            width={180}
            height={180}
            className="opacity-75"
          />
          <p className="text-gray-600 text-lg font-medium text-center">
            You haven't blocked any users yet!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-white">

      {/* Header */}
      <div className="h-24 flex items-center justify-center border-b border-gray-100">
        <h1 className="text-gray-800 font-semibold text-2xl">Blocked Users</h1>
      </div>

      {/* Table Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    No
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    User
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blockedUsersData.map((data: any) => (
                  <tr key={data._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {data.sNo}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <a
                          href={`/profile/${data.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-full overflow-hidden hover:opacity-90 transition-opacity"
                        >
                          <Image
                            src={data.profilePicUrl}
                            alt={data.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                            unoptimized
                          />
                        </a>
                        <a
                          href={`/profile/${data.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                        >
                          @{data.username}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <AlertDialog
                        onConfirm={() => unblock(data._id)}
                        alert={`Are you sure you want to unblock ${data.username}?`}
                      >
                        <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                          Unblock
                        </button>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center px-4 py-4 border-t border-gray-200">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Previous
                </button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg transition-colors ${
                          currentPage === page
                            ? "bg-blue-100 text-blue-600 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-lg transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlockedUsers;
