"use client";

import Image from "next/image";
import React, { useState } from "react";
import RequestModal from "./RequestModal";
interface ModernDocumentUploadProps {
  onClick: (success: boolean) => void;
}

const isRejected: React.FC<ModernDocumentUploadProps> = ({
  onClick,
}) => {
  return (
    <div className="w-full h-[75%] flex flex-col items-center justify-center">
      <div>
        <Image
          src={"/icons/rejected.png"}
          alt="pending icon"
          width={36}
          height={36}
        />
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-white font-semibold">
          Your request has been rejected since the proof was not enough!
        </h1>
        <h1 className="mt-2 text-white font-semibold">
          Try uploading your document once again:
        </h1>
        <RequestModal onClick={onClick} />
      </div>
    </div>
  );
}

export default isRejected;
