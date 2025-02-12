"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userService from "@/utils/apiCalls/userService";
import { toastOptions } from "@/utils/toastOptions";
import { Mail, LockKeyhole } from "lucide-react";

const VerifyUserForm: React.FC = () => {
  type Inputs = {
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>();

  const router = useRouter();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await toast.promise(
        userService.forgotPassword(data.email),
        {
          pending: "Verifying email...",
          success: "A new password has been sent to your email",
          error: "Failed to send new password",
        },
        toastOptions
      );
      router.push("/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data || "Failed to send new password";
      toast.error(errorMessage, toastOptions);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl p-8 text-center w-[400px]">
        {/* Icon Header */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75" />
            <div className="relative bg-gray-900 p-4 rounded-full">
              <LockKeyhole className="w-8 h-8 text-blue-400" />
            </div>
          </div>
        </div>

        <h1 className="text-white text-3xl font-bold mb-2">Forgot Password?</h1>
        <p className="text-gray-400 mb-8 text-sm">
          Enter your email and we'll send you a new password
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-2 text-left pl-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send New Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-gray-400 text-xs">
          <p className="leading-relaxed">
            We'll send a temporary password to your email.
            <br />
            Please change it after logging in.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyUserForm;
