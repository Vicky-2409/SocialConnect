"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

const PaymentCompleted = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showAnimation, setShowAnimation] = useState(true);

  const mihpayid = searchParams.get("mihpayid");
  const status = searchParams.get("status");

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (showAnimation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center">
        <Loader2 className="w-16 h-16 text-white/80 animate-spin" />
      </div>
    );
  }

  const isSuccess = status === "success";
  const StatusIcon = isSuccess ? CheckCircle : XCircle;
  const accentColor = isSuccess ? "emerald" : "rose";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-purple-800 flex items-center justify-center p-6">
      <div
        className={`
          w-full max-w-lg backdrop-blur-xl bg-white/10 rounded-3xl p-8 
          transform transition-all duration-700 ease-out shadow-2xl
          border border-white/20 relative overflow-hidden
          ${showAnimation ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
      >
        {/* Background Blur Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl -z-10" />

        <div className="flex flex-col items-center text-center space-y-8">
          {/* Status Icon */}
          <div
            className={`
            rounded-full p-4 
            ${isSuccess ? "bg-emerald-500/20" : "bg-rose-500/20"}
            transform transition-all duration-500 hover:scale-110
          `}
          >
            <StatusIcon
              className={`
              w-16 h-16 
              ${isSuccess ? "text-emerald-400" : "text-rose-400"}
            `}
            />
          </div>

          {/* Status Text */}
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h1>

          {/* Transaction ID Card */}
          <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 w-full border border-white/10">
            <p className="text-white/60 text-sm font-medium mb-2">
              Transaction ID
            </p>
            <p className="text-white font-mono tracking-wider text-lg break-all">
              {mihpayid}
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => router.push("/feed")}
            className={`
              w-full bg-gradient-to-r 
              ${
                isSuccess
                  ? "from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600"
                  : "from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600"
              }
              text-white font-semibold px-8 py-4 rounded-2xl
              transform transition-all duration-300
              hover:scale-[1.02] hover:shadow-lg
              active:scale-[0.98]
              flex items-center justify-center space-x-3
              text-lg
            `}
          >
            <span>{isSuccess ? "Continue to Feed" : "Return to Feed"}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCompleted;
