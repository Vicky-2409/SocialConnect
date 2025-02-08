import LoginForm from "@/components/LoginForm";
import React from "react";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900">
      <div className="flex min-h-screen">
        {/* Left side - decorative area */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />

          {/* Abstract shapes */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-20 w-full flex flex-col justify-center items-center text-white p-12">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-300 text-center max-w-md">
              Connect with creators and join our vibrant community of innovators
            </p>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
