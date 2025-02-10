"use client";

import React from "react";
import Image from "next/image";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatDate } from "@/utils/formatString";
import adsService from "@/utils/apiCalls/admin/adsService";
import { toastOptions } from "@/utils/toastOptions";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AlertDialog from "@/components/settings/AlertDialog";

type AdsData = {
  _id: string;
  sNo: number;
  advertisementId: string;
  username: string;
  postId: string;
  postImageUrl: string;
  PayUTransactionId: string;
  transactionAmount: number;
  transactionDate: string;
  expiresOn: string;
  isActive: boolean;
};

export default function AdsManagementTable() {
  const [adsData, setAdsData] = React.useState<AdsData[]>();
  const [changed, setChanged] = React.useState(false);
  const [documentCount, setDocumentCount] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  React.useEffect(() => {
    (async function (currentPage: number, rowsPerPage: number) {
      try {
        const [responseFormat, count] = await adsService.getAdsManagementData(
          currentPage,
          rowsPerPage
        );
        console.log(responseFormat);
        
        setAdsData(responseFormat);
        setDocumentCount(count);
      } catch (error: any) {
        toast.error(error.message, toastOptions);
      }
    })(currentPage, rowsPerPage);
  }, [currentPage, rowsPerPage, changed]);

  const toggleStatus = async (postId: string) => {
    try {
      await toast.promise(
        adsService.toggleStatus(postId),
        {
          pending: "Changing ad status",
          success: "Ad status changed successfully",
          error: "Error changing ad status",
        },
        toastOptions
      );
      setChanged(!changed);
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    }
  };

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
                  Ad ID
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Username
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Post
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Amount
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Transaction Date
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Expires On
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {adsData?.map((ad) => (
                <tr
                  key={ad.advertisementId}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {ad.sNo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {ad.advertisementId}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {ad.username}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative h-10 w-10">
                      <Image
                        src={ad.postImageUrl}
                        alt="Post Image"
                        fill
                        className="rounded-lg object-cover"
                        unoptimized
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {ad.PayUTransactionId}
                  </td>
                  <td className="px-6 py-4 text-sm text-green-600 font-semibold">
                    ₹{ad.transactionAmount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(ad.transactionDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(ad.expiresOn)}
                  </td>
                  <td className="px-6 py-4">
                    <AlertDialog
                      onConfirm={() => toggleStatus(ad.postId)}
                      alert="Are you sure you want to change the ad status?"
                    >
                      <button
                        className={`
                          px-3 py-1.5 rounded-lg text-sm font-medium 
                          ${
                            ad.isActive
                              ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }
                        `}
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </button>
                    </AlertDialog>
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
              <option value={1}>5 rows</option>
              <option value={2}>10 rows</option>
              <option value={3}>25 rows</option>
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
