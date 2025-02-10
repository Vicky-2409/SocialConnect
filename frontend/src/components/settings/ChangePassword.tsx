import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {  toast } from "react-toastify";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import { toastOptions } from "@/utils/toastOptions";
import userService from "@/utils/apiCalls/userService";

type Inputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm<Inputs>();

  const router = useRouter();
  const newPassword = watch("newPassword");

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const onSubmit = async (data: Inputs) => {
    try {
      // Check if new password matches confirm password
      if (data.newPassword !== data.confirmPassword) {
        setError("confirmPassword", {
          type: "manual",
          message: "Passwords do not match",
        });
        return;
      }

      // Check if new password is same as current password
      if (data.newPassword === data.currentPassword) {
        setError("newPassword", {
          type: "manual",
          message: "New password must be different from current password",
        });
        return;
      }

      await toast.promise(
        userService.changePassword(data.currentPassword, data.newPassword),
        {
          pending: "Updating your password...",
          success: "Password updated successfully! 🎉",
          error: "Oops! Something went wrong 😕",
        },
        toastOptions
      );
      router.replace("/settings");
    } catch (error: any) {
      toast.error(error.message, toastOptions);
    }
  };

  const togglePassword = (field: keyof Inputs) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-6 md:p-8">


      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg shadow-blue-500/5 overflow-hidden">
        <div className="px-6 pt-8 pb-6">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <ShieldCheck className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Change Password
            </h1>
            <p className="text-sm text-gray-500 text-center">
              Choose a strong password to keep your account secure
            </p>
          </div>
        </div>

        <div className="px-6 pb-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="relative space-y-2">
              <input
                type={showPasswords.currentPassword ? "text" : "password"}
                placeholder="Current Password"
                className={`w-full pl-12 pr-12 py-4 rounded-xl bg-gray-50/50 border ${
                  errors.currentPassword ? "border-red-500" : ""
                }`}
                {...register("currentPassword", {
                  required: "Current password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => togglePassword("currentPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.currentPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="relative space-y-2">
              <input
                type={showPasswords.newPassword ? "text" : "password"}
                placeholder="New Password"
                className={`w-full pl-12 pr-12 py-4 rounded-xl bg-gray-50/50 border ${
                  errors.newPassword ? "border-red-500" : ""
                }`}
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                })}
              />
              <button
                type="button"
                onClick={() => togglePassword("newPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.newPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="relative space-y-2">
              <input
                type={showPasswords.confirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={`w-full pl-12 pr-12 py-4 rounded-xl bg-gray-50/50 border ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
              />
              <button
                type="button"
                onClick={() => togglePassword("confirmPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirmPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl font-medium text-white
                transition-all duration-300 transform
                bg-blue-500 hover:bg-blue-600 active:bg-blue-700 
                hover:shadow-lg hover:shadow-blue-500/30
                disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
