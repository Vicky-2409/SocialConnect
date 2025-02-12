"use client";
import React, { useEffect, useState } from "react";
import IsApprovedComponent from "./isApproved";
import IsPendingComponent from "./isPending";
import IsRejectedComponent from "./isRejected";
import RequestModal from "./RequestModal";
import userService from "@/utils/apiCalls/userService";
import { motion } from "framer-motion";

function RequestWeNetTick() {
  const [hasRequested, setHasRequested] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modelChange, setModelChange] = useState(false);

  useEffect(() => {
    (async function () {
      try {
        const { hasRequestedTick, status } =
          await userService.hasRequestedTick();
        setHasRequested(hasRequestedTick);
        if (hasRequestedTick) setStatus(status);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [modelChange]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-white font-bold text-xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
      <div className="w-full p-6 text-center bg-white/10">
        <h1 className="font-bold text-white text-2xl tracking-wide">
          Verified Tick
        </h1>
      </div>

      {hasRequested ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          {status === "approved" && <IsApprovedComponent />}
          {status === "pending" && <IsPendingComponent />}
          {status === "rejected" && (
            <IsRejectedComponent onClick={setModelChange} />
          )}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex flex-col items-center justify-center space-y-6 p-6"
        >
          <div className="text-center">
            <h2 className="font-semibold text-white text-xl mb-4">
              Verify Your Professional Account
            </h2>
            <p className="text-white/80 max-w-md mx-auto">
              Submit official documents to get your verified badge
            </p>
          </div>

          <RequestModal onClick={setModelChange} />
        </motion.div>
      )}
    </div>
  );
}

export default RequestWeNetTick;
