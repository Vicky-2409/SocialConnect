"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Bounce, ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";
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

function AdminLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  type Inputs = {
    username: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      await toast.promise(
        userService.adminLogin(data),
        {
          pending: "Logging in",
          success: "Logged in successfully",
          error: "Failed to login",
        },
        toastOptions
      );
      setTimeout(() => router.replace("admin/dashboard"), 2500);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.length
        ? error.response.data
        : "Failed to Login";
      toast.error(errorMessage, toastOptions);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="username"
                placeholder="Username"
                {...register("username", {
                  required: "Username is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_]{3,16}$/,
                    message:
                      "Username must be 3-16 characters long and can only contain letters, numbers, and underscores",
                  },
                  minLength: {
                    value: 5,
                    message: "Enter at least 5 characters",
                  },
                })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>
            {errors.username && (
              <div className="text-sm text-red-500 px-1">
                {errors.username.message}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <div className="relative flex items-center">
              <div className="absolute left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                {...register("password", {
                  required: "Enter a password",
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
                    message:
                      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character",
                  },
                })}
                className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            {errors.password && (
              <div className="text-sm text-red-500 px-1">
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl 
              ${
                isLoading
                  ? "opacity-80 cursor-not-allowed"
                  : "hover:from-blue-700 hover:to-indigo-700"
              } 
              transform transition-all duration-200 ease-in-out hover:scale-[1.02] active:scale-[0.98]`}
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

export default AdminLoginForm;
