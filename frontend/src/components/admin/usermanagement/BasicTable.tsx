"use client";
import * as React from "react";
import { Bounce,  ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeft, ChevronRight, Users2 } from "lucide-react";
import userService from "@/utils/apiCalls/admin/userService";

const toastOptions: ToastOptions = {
  position: "top-center",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  transition: Bounce,
};

interface Column {
  id:
    | "username"
    | "fullName"
    | "email"
    | "accountStatus"
    | "privacy"
    | "followersCount"
    | "followingCount";
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: "username", label: "Username", minWidth: 100 },
  { id: "fullName", label: "Full Name", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 170 },
  { id: "accountStatus", label: "Status", minWidth: 100, align: "center" },
  { id: "privacy", label: "Privacy", minWidth: 100, align: "center" },
  {
    id: "followersCount",
    label: "Followers",
    minWidth: 100,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
  {
    id: "followingCount",
    label: "Following",
    minWidth: 100,
    align: "right",
    format: (value: number) => value.toLocaleString("en-US"),
  },
];

interface Data {
  username: string;
  fullName: string;
  email: string;
  accountStatus: string;
  privacy: string;
  followersCount: number;
  followingCount: number;
  isRestricted: boolean;
}

function createData(
  username: string,
  fullName: string,
  email: string,
  accountStatus: string,
  privacy: string,
  followersCount: number,
  followingCount: number,
  isRestricted: boolean
): Data {
  return {
    username,
    fullName,
    email,
    accountStatus,
    privacy,
    followersCount,
    followingCount,
    isRestricted,
  };
}

export default function AdminUserManagementTable() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState<Data[]>([]);

  React.useEffect(() => {
    (async function grabData() {
      try {
        let data: any = await userService.getUsersData()
        const users = data.map((user: any) =>
          createData(
            user.username,
            `${user.firstName} ${user.lastName}`,
            user.email,
            user.isRestricted ? "Restricted" : "Unrestricted",
            user.isPrivate ? "Private" : "Public",
            user.followers.length,
            user.following.length,
            user.isRestricted
          )
        );
        setRows(users);
      } catch (error: any) {
        const errorMessage =
          error.response && error.response.data
            ? error.response.data
            : "Failed to get user data";
        toast.error(errorMessage, toastOptions);
      }
    })();
  }, []);

  const handleBlockUnblock = async (
    username: string,
    isRestricted: boolean
  ) => {
    try {


      const response = await userService.blockUser(username, !isRestricted)
      if (response.data.success) {
        const updatedRows = rows.map((row) =>
          row.username === username
            ? {
                ...row,
                isRestricted: !isRestricted,
                accountStatus: isRestricted ? "Unrestricted" : "Restricted",
              }
            : row
        );
        setRows(updatedRows);
        toast.success(
          `User ${isRestricted ? "unblocked" : "blocked"} successfully`,
          toastOptions
        );
      }
    } catch (error: any) {
      toast.error("Failed to update user status", toastOptions);
    }
  };
  if (rows.length <= 0)
    return (
      <div className="min-h-[440px] w-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Users2 className="w-12 h-12 text-gray-400 animate-pulse" />
          <p className="text-gray-500 text-lg">No user data...</p>
        </div>
      </div>
    );

  if (!rows.length)
    return (
      <div className="min-h-[440px] w-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Users2 className="w-12 h-12 text-gray-400 animate-pulse" />
          <p className="text-gray-500 text-lg">Loading user data...</p>
        </div>
      </div>
    );

  return (
    <div className="w-full">
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                {columns.map((column) => (
                  <th
                    key={column.id}
                    className={`px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100 ${
                      column.align === "right"
                        ? "text-right"
                        : column.align === "center"
                        ? "text-center"
                        : "text-left"
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <tr
                    key={row.username}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <td
                          key={column.id}
                          className={`px-6 py-4 text-sm text-gray-700 dark:text-gray-300 ${
                            column.align === "right"
                              ? "text-right"
                              : column.align === "center"
                              ? "text-center"
                              : "text-left"
                          }`}
                        >
                          {column.id === "accountStatus" && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                value === "Restricted"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              }`}
                            >
                              {value}
                            </span>
                          )}
                          {column.id === "privacy" && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                value === "Private"
                                  ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                              }`}
                            >
                              {value}
                            </span>
                          )}
                          {column.id !== "accountStatus" &&
                            column.id !== "privacy" &&
                            (column.format && typeof value === "number"
                              ? column.format(value)
                              : value)}
                        </td>
                      );
                    })}
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          handleBlockUnblock(row.username, row.isRestricted)
                        }
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          row.isRestricted
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50"
                            : "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        }`}
                      >
                        {row.isRestricted ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="block w-full rounded-lg border-gray-200 dark:border-gray-700 text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800"
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={100}>100 rows</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {page + 1} of {Math.ceil(rows.length / rowsPerPage)}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= Math.ceil(rows.length / rowsPerPage) - 1}
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
