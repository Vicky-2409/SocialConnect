"use client";
import React from "react";
import Image from "next/image";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDate } from "@/utils/formatString";
import postService from "@/utils/apiCalls/postService";
import userService from "@/utils/apiCalls/userService";
import AlertDialog from "@/components/settings/AlertDialog";
import { toastOptions } from "@/utils/toastOptions";
import {
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Shield,
  Check,
  UserX,
  X,
} from "lucide-react";
import { useState } from "react";

type Report = {
  _id: string;
  userId: string;
  date: string;
  reportedBy: string;
  entityType: "posts" | "comments" | "users";
  entity: { entityId: string; imageUrl?: string };
  entityId: string;
  entityImage: string;
  type: string;
  description: string;
  isResolved: boolean;
};

export default function ReportManagementTable() {
  const [reports, setReports] = useState<Report[]>();
  const [changed, setChanged] = useState(false);
  const [documentCount, setdocumentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  React.useEffect(() => {
    (async function (currentPage: number, rowsPerPage: number) {
      try {
        let [reports, documentCount] =
          await postService.getReportManagementData(currentPage, rowsPerPage);
          console.log(reports);
          
        reports = reports.map((report: any) => ({
          _id: report._id,
          userId: report.entityId.userId,
          date: formatDate(report.updatedAt),
          reportedBy: report.reportedBy.username,
          entityType: report.entityType,
          entity: {
            entityId: report.entityId._id,
            imageurl: report.entityId.imageUrls[0],
          },
          entityId: report.entityId._id,
          entityImage: report.entityId.imageUrls[0],
          type: report.reportType,
          description: report.reportDescription,
          isResolved: report.isResolved,
        }));
        setReports(reports);
        setdocumentCount(documentCount);
      } catch (error: any) {
        toast.error(error);
      }
    })(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, changed]);

  const handleDelete = async (
    reportId: string,
    entityType: "posts" | "comments" | "users",
    entityId: string
  ) => {
    try {
      if (entityType === "posts") await postService.deletePostByAdmin(entityId);
      await toast.promise(
        postService.resolveReport(reportId),
        {
          pending: "Deleting the entity",
          success: "Entity deleted successfully",
          error: "Error deleting the entity",
        },
        toastOptions
      );
      setChanged(!changed);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    }
  };

  const handleRestrictUser = async (
    userId: string,
    days: number,
    reportId: string
  ) => {
    try {
      await toast.promise(
        userService.restrictUserByAdmin(userId, days),
        {
          pending: "Restricting user...",
          success: `User restricted for ${days} days successfully`,
          error: "Error restricting the user",
        },
        toastOptions
      );
      await postService.resolveReport(reportId);
      setChanged(!changed);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(event.target.value));
  };

  const handleCloseReport = async (reportId: string) => {
    try {
      await toast.promise(
        postService.resolveReport(reportId),
        {
          pending: "Closing the report",
          success: "Report resolved successfully",
          error: "Error closing the report",
        },
        toastOptions
      );
      setChanged(!changed);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    }
  };

  return (
    <div className="w-full">
      <ToastContainer />
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Reported By
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Type
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Content
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Issue
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Description
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {reports?.map((report) => (
                <tr
                  key={report._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    <span className="inline-flex items-center space-x-1">
                      <span>@{report.reportedBy}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        report.entityType === "posts"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : report.entityType === "comments"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                      }`}
                    >
                      {report.entityType === "posts" && "Post"}
                      {report.entityType === "comments" && "Comment"}
                      {report.entityType === "users" && "User"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {report.entityType === "posts" && report.entityImage && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                        <Image
                          src={report.entityImage}
                          alt="Post Image"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {report.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    {report.isResolved ? (
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                        <Check className="w-5 h-5" />
                        <span className="text-sm font-medium">Resolved</span>
                      </div>
                    ) : report.entityType === "users" ? (
                      <></>
                    ) : (
                      <div className="flex flex-col space-y-2">
                        <AlertDialog
                          onConfirm={() =>
                            handleDelete(
                              report._id,
                              report.entityType,
                              report.entity.entityId
                            )
                          }
                          alert="Do you really want to delete the post?"
                        >
                          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                            <X className="w-4 h-4 mr-1" />
                            Delete
                          </button>
                        </AlertDialog>
                        <AlertDialog
                          onConfirm={() =>
                            handleRestrictUser(report.userId, 7, report._id)
                          }
                          alert="Restrict user from posting for 7 days?"
                        >
                          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors">
                            <UserX className="w-4 h-4 mr-1" />
                            Restrict
                          </button>
                        </AlertDialog>
                        <AlertDialog
                          onConfirm={() => handleCloseReport(report._id)}
                          alert="Do you really want to close this report?"
                        >
                          <button className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                            <Shield className="w-4 h-4 mr-1" />
                            Close
                          </button>
                        </AlertDialog>
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
