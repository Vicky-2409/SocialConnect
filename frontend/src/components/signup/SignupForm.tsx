"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast, Bounce, ToastOptions } from "react-toastify";
import { useDispatch } from "react-redux";
import { verifyUser } from "@/redux/userSlice";
import { motion } from "framer-motion";
import LoginWithGoogle from "../LoginWithGoogle";
import { Eye, EyeOff } from "lucide-react";
import userService from "@/utils/apiCalls/userService";

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

interface SignupFormProps {
  setIsVerifyForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignupForm: React.FC<SignupFormProps> = ({ setIsVerifyForm }) => {
  type Inputs = {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
  };

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response: any = await toast.promise(
        userService.userSignup(data),
        {
          pending: "Creating your account...",
          success: "Welcome aboard! 🎉",
          error: "Oops! Something went wrong",
        },
        toastOptions
      );
      dispatch(verifyUser({ _id: response.data._id }));
      setIsVerifyForm(true);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.length
        ? error.response.data
        : "Something went wrong. Please try again.";
      toast.error(errorMessage, toastOptions);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10"
      >
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Create Account
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300/80"
            >
              Join our creative community
            </motion.p>
          </div>

          {/* Social Login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4 flex justify-center"
          >
            <LoginWithGoogle />
          </motion.div>

          <div className="relative">
            <div className="relative flex justify-center">
              <span className="px-6 py-2 text-sm text-gray-400/90 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                or continue with email
              </span>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {/* Previous inputs remain the same */}
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username", {
                    required: "Username required",
                    pattern: {
                      value: /^(?=.{1,15}$)[A-Za-z][A-Za-z0-9._]*$/,
                      message: "Use letters, numbers, periods, or underscores",
                    },
                  })}
                  className="w-full px-5 py-4 bg-white/5 text-white placeholder-gray-400/80 rounded-2xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                />
                {errors.username && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/90 text-sm mt-2 ml-2"
                  >
                    {errors.username.message}
                  </motion.p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    {...register("firstName", {
                      required: "First name required",
                      minLength: { value: 2, message: "Too short" },
                    })}
                    className="w-full px-5 py-4 bg-white/5 text-white placeholder-gray-400/80 rounded-2xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  />
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400/90 text-sm mt-2 ml-2"
                    >
                      {errors.firstName.message}
                    </motion.p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    {...register("lastName", {
                      required: "Last name required",
                      minLength: { value: 2, message: "Too short" },
                    })}
                    className="w-full px-5 py-4 bg-white/5 text-white placeholder-gray-400/80 rounded-2xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                  />
                  {errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400/90 text-sm mt-2 ml-2"
                    >
                      {errors.lastName.message}
                    </motion.p>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  type={showPassword.password ? "text" : "password"}
                  placeholder="Password"
                  {...register("password", {
                    required: "Password required",
                    pattern: {
                      value:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+~`|}{[\]:;?><,./-]).{8,}$/,
                      message: "Password too weak",
                    },
                  })}
                  className="w-full px-5 py-4 bg-white/5 text-white placeholder-gray-400/80 rounded-2xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword.password ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/90 text-sm mt-2 ml-2"
                  >
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === getValues("password") ||
                      "Passwords don't match",
                  })}
                  className="w-full px-5 py-4 bg-white/5 text-white placeholder-gray-400/80 rounded-2xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 pr-12"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/90 text-sm mt-2 ml-2"
                  >
                    {errors.confirmPassword.message}
                  </motion.p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold rounded-2xl transition-all duration-300"
            >
              Sign Up
            </button>
          </motion.form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-400/90">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400 hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;
