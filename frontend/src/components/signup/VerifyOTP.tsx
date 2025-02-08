"use client";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { ToastContainer, toast, Bounce, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { USER_SERVICE_URL } from "@/utils/constants";
import { motion } from "framer-motion";
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

const VerifyOTP: React.FC = () => {
  type Inputs = {
    _id: string;
    otp: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const router = useRouter();
  const _id = useSelector((store: any) => store.user?.verifyUser);

  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const userServiceUrl = USER_SERVICE_URL;
      data._id = _id;

      await toast.promise(
        userService.verifyOTP(data),
        {
          pending: "Verifying OTP",
          success: "OTP verified successfully",
          error: "Failed to verify OTP",
        },
        toastOptions
      );
      router.replace("/login");
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data
          : "Failed to verify OTP";
      console.error(errorMessage);
    }
  };

  const resendOTP = async () => {
    try {
      await toast.promise(
        userService.resentOTP({ _id }),
        {
          pending: "Sending OTP",
          success: "OTP resent successfully",
          error: "Failed to resend OTP",
        },
        toastOptions
      );
      setTimer(60); // Reset timer after resending OTP
    } catch (error: any) {
      const errorMessage =
        error.response && error.response.data
          ? error.response.data.message
          : "Failed to resend OTP";
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
              Verify OTP
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300/80"
            >
              Enter the OTP sent to your email
            </motion.p>
          </div>

          {/* OTP Form */}
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
                  type="tel"
                  placeholder="Enter OTP"
                  {...register("otp", {
                    required: "OTP is required",
                    pattern: {
                      value: /^\d{4}$/,
                      message: "Please enter a valid 4-digit OTP",
                    },
                  })}
                  className="w-full px-5 py-4 bg-white/5 text-white placeholder-gray-400/80 rounded-2xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                />
                {errors.otp && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/90 text-sm mt-2 ml-2"
                  >
                    {errors.otp.message}
                  </motion.p>
                )}
              </div>
            </div>

            {timer > 0 && (
              <div className="text-xl text-white font-bold mb-4">
                {`${timer} secs`}
              </div>
            )}

            <div className="w-full flex justify-center items-center">
              {timer > 0 ? (
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-4 rounded-2xl font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
                >
                  Verify OTP
                </button>
              ) : (
                <button
                  type="button"
                  onClick={resendOTP}
                  className="w-full bg-gradient-to-r from-gray-500 to-gray-700 text-white py-4 rounded-2xl font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyOTP;
