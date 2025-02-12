"use client";
import React, { useState } from "react";
import Link from "next/link";
import LoginWithGoogle from "./LoginWithGoogle";
import { useForm, SubmitHandler } from "react-hook-form";
import { Bounce, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loginUser } from "@/redux/userSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  type Inputs = {
    username: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      let response: any = await toast.promise(
        userService.userLogin(data),
        {
          pending: "Logging in",
          success: "Welcome back! 🎉",
          error: "Failed to login",
        },
        toastOptions
      );
      dispatch(loginUser({ _id: response.data._id }));
      setTimeout(() => router.replace("/feed"), 2500);
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
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
              Welcome Back
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300/80"
            >
              Sign in to continue creating
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

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
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
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
            </div>

            <div className="flex justify-end">
              <Link
                href="/forgotPassword"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-300"
              >
                Forgot Password?
              </Link>
            </div>

            <motion.button
              whileHover={{
                scale: 1.01,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-2xl font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            >
              Sign In
            </motion.button>
          </motion.form>

          <p className="text-center text-gray-400/80">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-purple-400 hover:text-purple-300 transition-colors duration-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginForm;
