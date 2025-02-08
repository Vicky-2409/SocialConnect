"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignupForm from "@/components/signup/SignupForm";
import VerifyUserForm from "@/components/signup/VerifyUserForm";
import VerifyOTP from "@/components/signup/VerifyOTP";

function CenterDiv() {
  const [isVerifyForm, setIsVerifyForm] = useState(false);
  const [isVerifyOTPComp, setIsVerifyOTPComp] = useState(false);

  const verifyUserComponent = isVerifyOTPComp ? (
    <VerifyOTP />
  ) : (
    <VerifyUserForm setIsVerifyOTPComp={setIsVerifyOTPComp} />
  );

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={isVerifyForm ? "verify" : "signup"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            {isVerifyForm ? (
              verifyUserComponent
            ) : (
              <SignupForm setIsVerifyForm={setIsVerifyForm} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CenterDiv;
