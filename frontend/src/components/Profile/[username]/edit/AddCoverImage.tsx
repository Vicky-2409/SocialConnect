"use client";
import React, { useState, createRef, ChangeEvent, FormEvent } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import Image from "next/image";
import { Bounce, ToastContainer, ToastOptions, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { USER_SERVICE_URL } from "@/utils/constants";
import userService from "@/utils/apiCalls/userService";

type ReactCropperElement = HTMLDivElement & {
  cropper: Cropper;
};

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

const AddCoverImage: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const cropperRef = createRef<ReactCropperElement | any>();
  const [cropData, setCropData] = useState<string>("/");

  const router = useRouter();

  function imageHandler(e: ChangeEvent<HTMLInputElement> | DragEvent) {
    e.preventDefault();
    let files: FileList | null = null;
    if ("dataTransfer" in e && e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if ("target" in e && e.target) {
      files = (e.target as HTMLInputElement).files;
    }
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    }
  }

  async function dataURLtoBlob(dataURL: string): Promise<Blob> {
    const res = await fetch(dataURL);
    const blob = await res.blob();
    return blob;
  }

  async function uploadImage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedDataURL = cropperRef.current.cropper
        .getCroppedCanvas()
        .toDataURL();
      const croppedBlob = await dataURLtoBlob(croppedDataURL);

      const formData = new FormData();
      formData.append("image", croppedBlob, "croppedImage.png");

      const userServiceUrl = USER_SERVICE_URL;

      try {
        await toast.promise(
          userService.addCoverImage(formData),
          {
            pending: "Uploading image...",
            success: "Image uploaded successfully!",
            error: "Image upload failed",
          },
          toastOptions
        );
        router.back();
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      }
    }
  }

  return (
    <form
      onSubmit={uploadImage}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 rounded-xl shadow-md"
      encType="multipart/form-data"
    >
      <ToastContainer />
      {cropData && (
        <Image
          width={100}
          height={100}
          alt="galleryPic"
          src={cropData}
          className="hidden"
          unoptimized
        />
      )}

      <div className="w-full flex flex-col items-center space-y-6">
        <h1 className="text-gray-800 font-bold text-3xl mb-4 tracking-wide">
          Add Cover Picture
        </h1>

        <div className="w-full max-w-md flex flex-col items-center space-y-4">
          {image ? (
            <div className="w-full bg-white rounded-xl shadow-sm p-4">
              <Cropper
                ref={cropperRef}
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={1}
                preview=".img-preview"
                src={image}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
                aspectRatio={21 / 9}
              />
            </div>
          ) : (
            <div className="p-8 bg-gray-200 rounded-full shadow-md">
              <Image
                width={120}
                height={120}
                alt="galleryPic"
                src={"/icons/gallery.svg"}
                className="opacity-60"
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col items-center gap-6 w-full">
          <input
            type="file"
            name="image"
            onChange={imageHandler}
            accept="image/*"
            className="bg-white text-gray-700 font-semibold py-3 px-6 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
          {image && (
            <button
              type="submit"
              className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              Upload
            </button>
          )}
        </div>
      </div>

      {/* Adding some margin to the bottom of the form */}
      <div className="mt-12"></div>
    </form>
  );
};

export default AddCoverImage;
