"use client";

import React from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/formatString";
import { toastOptions } from "@/utils/toastOptions";
import "react-toastify/dist/ReactToastify.css";
import AlertDialog from "@/components/settings/AlertDialog";
import userService from "@/utils/apiCalls/admin/userService";
import { ChevronLeft, ChevronRight } from "lucide-react";

type RequestData = {
  requestId: string;
  userId: string;
  sNo: number;
  firstName: string;
  lastName: string;
  username: string;
  profilePicUrl: string;
  createdAt: string;
  imageUrl: string;
  description: string;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
};

export default function WeNetTickManagementTable() {
  const [requestsData, setRequestsData] = React.useState<RequestData[]>();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [documentCount, setDocumentCount] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [changed, setChanged] = React.useState(false);
  const [statusValue, setStatusValue] = React.useState<
    "approved" | "rejected" | "pending"
  >("pending");
  const [rejectionReason, setRejectionReason] = React.useState("");

  React.useEffect(() => {
    (async function (currentPage: number, rowsPerPage: number) {
      try {
        const [responseFormat, documentCount] =
          await userService.getTickRequestsData(currentPage, rowsPerPage);
        setRequestsData(responseFormat);
        setDocumentCount(documentCount);
      } catch (error: any) {
        toast.error(error.message, toastOptions);
      }
    })(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, changed]);

  async function changeStatus(requestId: string, userId: string) {
    try {
      if (statusValue === "pending") {
        throw new Error("Selected status value not found");
      }

      if (statusValue === "rejected" && !rejectionReason.trim()) {
        throw new Error("Please provide a reason for rejection");
      }

      await toast.promise(
        userService.changeTickRequestStatus(
          requestId,
          statusValue,
          userId,
          statusValue === "rejected" ? rejectionReason : undefined
        ),
        {
          pending: "Processing request...",
          success: "Status updated successfully",
          error: "Failed to update status",
        },
        toastOptions
      );
      setRejectionReason("");
      setChanged((prev) => !prev);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    }
  }

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
  };

  return (
    <div className="w-full">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  S No
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  User
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Requested On
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Document
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Description
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {requestsData?.map((data) => (
                <tr
                  key={data.requestId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {data.sNo}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative h-10 w-10">
                        <Image
                          src={data.profilePicUrl}
                          alt="Profile"
                          fill
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <a
                          href={`/profile/${data.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {`${data.firstName} ${data.lastName}`}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            @{data.username}
                          </div>
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(data.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = data.imageUrl;
                        link.target = "_blank";
                        link.download = "document.jpg";
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                    >
                      View Document
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {data.description}
                  </td>
                  <td className="px-6 py-4">
                    {data.status === "pending" ? (
                      <div className="flex flex-col space-y-2">
                        <select
                          className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                          onChange={(e) => {
                            setStatusValue(e.target.value as any);
                            if (e.target.value !== "rejected") {
                              setRejectionReason("");
                            }
                          }}
                          value={statusValue}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approve</option>
                          <option value="rejected">Reject</option>
                        </select>
                        {statusValue === "rejected" && (
                          <textarea
                            placeholder="Enter reason for rejection"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none w-full resize-none"
                            rows={3}
                          />
                        )}
                        <AlertDialog
                          onConfirm={() =>
                            changeStatus(data.requestId, data.userId)
                          }
                          alert={`Are you sure you want to ${
                            statusValue === "rejected" ? "reject" : "approve"
                          } this request?`}
                        >
                          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            Update
                          </button>
                        </AlertDialog>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div
                          className={`inline-flex items-center px-3 py-1.5 rounded-lg space-x-2 ${
                            data.status === "approved"
                              ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }`}
                        >
                          <Image
                            src={
                              data.status === "approved"
                                ? "/icons/Verified-tick.png"
                                : "/icons/rejected.png"
                            }
                            alt={data.status}
                            width={24}
                            height={24}
                          />
                          <span className="text-sm font-medium">
                            {data.status.charAt(0).toUpperCase() +
                              data.status.slice(1)}
                          </span>
                        </div>
                        {data.status === "rejected" && data.rejectionReason && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Reason: {data.rejectionReason}
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <select
              value={rowsPerPage}
              onChange={handlePageChange}
              className="block rounded-lg border-gray-200 dark:border-gray-700 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800"
            >
              <option value={5}>5 rows</option>
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {Math.ceil(documentCount / rowsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(documentCount / rowsPerPage)}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
