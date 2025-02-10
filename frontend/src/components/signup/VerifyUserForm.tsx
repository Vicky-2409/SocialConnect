"use client";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { Bounce, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateDateOfBirth } from "@/utils/validateDOB";
import { USER_SERVICE_URL } from "@/utils/constants";
import { motion } from "framer-motion";
import userService from "@/utils/apiCalls/userService";

interface VerifyUserFormProps {
  setIsVerifyOTPComp: React.Dispatch<React.SetStateAction<boolean>>;
}

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

const VerifyUserForm: React.FC<VerifyUserFormProps> = ({
  setIsVerifyOTPComp,
}) => {
  type Inputs = {
    _id?: string;
    email: string;
    dateOfBirth: Date;
    gender: string;
  };

  const { verifyUser } = useSelector((store: any) => store.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const userServiceUrl = USER_SERVICE_URL;
      data._id = verifyUser;

      await toast.promise(
        userService.sentOTP( data),
        {
          pending: "Sending OTP",
          success: "OTP sent successfully",
          error: "Failed to send OTP",
        },
        toastOptions
      );

      setIsVerifyOTPComp(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP";
      toast.error(errorMessage, toastOptions);
    }
  };

  return (
    <div className="w-full h-screen bg-cover bg-center flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 w-[370px]"
      >
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Verify User
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300/80"
            >
              Please verify your details to continue.
            </motion.p>
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
                  placeholder="Email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  className="w-full px-5 py-4 bg-white/5 text-white placeholder-gray-400/80 rounded-2xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/90 text-sm mt-2 ml-2"
                  >
                    {errors.email.message}
                  </motion.p>
                )}
              </div>

              <div>
                <input
                  type="date"
                  {...register("dateOfBirth", {
                    required: "Date of birth is required",
                    validate: validateDateOfBirth,
                  })}
                  className="w-full px-5 py-4 bg-white/5 text-white placeholder-gray-400/80 rounded-2xl border border-white/10 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 calendar-white"
                />
                {errors.dateOfBirth && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/90 text-sm mt-2 ml-2"
                  >
                    {errors.dateOfBirth.message}
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-bold mb-2 text-left">
                  Gender
                </label>
                <div className="flex justify-between">
                  <label className="flex items-center text-white font-semibold">
                    <input
                      type="radio"
                      value="male"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="mr-2 focus:ring-blue-500"
                    />
                    Male
                  </label>
                  <label className="flex items-center text-white font-semibold">
                    <input
                      type="radio"
                      value="female"
                      {...register("gender", {
                        required: "Gender is required",
                      })}
                      className="mr-2 focus:ring-blue-500"
                    />
                    Female
                  </label>
                </div>
                {errors.gender && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400/90 text-sm mt-2 ml-2"
                  >
                    {errors.gender.message}
                  </motion.p>
                )}
              </div>
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
              Send OTP
            </motion.button>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyUserForm;
