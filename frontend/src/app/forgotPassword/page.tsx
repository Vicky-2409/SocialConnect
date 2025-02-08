import React from "react";
import SendEmailComponent from "@/components/forgotPassword/SendEmailComponent";

const ForgetPassword = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="flex min-h-screen">
        {/* Left side - Decorative area */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />

          {/* Animated floating orbs */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 animate-pulse">
            <div className="w-full h-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl transform-gpu transition-transform duration-1000" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 animate-pulse delay-700">
            <div className="w-full h-full bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl transform-gpu transition-transform duration-1000" />
          </div>

          {/* Additional decorative elements */}
          <div className="absolute top-1/3 right-1/3 w-48 h-48 animate-pulse delay-500">
            <div className="w-full h-full bg-gradient-to-r from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl" />
          </div>

          {/* Content */}
          <div className="relative z-20 w-full flex flex-col justify-center items-center text-white p-12 space-y-8">
            <div className="text-center space-y-6">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Forgot Your Password?
              </h1>
              <p className="text-xl text-gray-300 max-w-md leading-relaxed">
                No worries! Enter your email and we'll send you a new password.
              </p>
            </div>

            {/* Additional info */}
            <div className="mt-12 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-white/5 backdrop-blur-md rounded-lg max-w-sm">
                  <p className="text-sm text-gray-300">
                    We'll send you a secure temporary password that you can use
                    to access your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-8 lg:p-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden text-center mb-8 space-y-4">
              <h1 className="text-3xl font-bold text-white">
                Forgot Your Password?
              </h1>
              <p className="text-gray-300">
                Enter your email to receive a new password.
              </p>
            </div>
            <SendEmailComponent />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
