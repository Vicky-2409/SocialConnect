"use client";
import postService from "@/utils/apiCalls/postService";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Bounce, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChevronLeft, ChevronRight, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

type Input = {
  _id: string;
  caption: string;
};

interface Post {
  _id: string;
  imageUrls: string[];
  caption: string;
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

// ... Keep ImageCarousel component the same ...
const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
      {/* Current Image */}
      <Image
        src={images[currentIndex]}
        fill
        alt={`Post image ${currentIndex + 1}`}
        className="object-cover transition-transform hover:scale-105 duration-300"
        unoptimized
      />

      {/* Navigation Arrows - Only show if there are multiple images */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors duration-200"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Navigation Dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  currentIndex === index
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const [postData, setPostData] = useState<null | Post>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<Input>();

  const caption = watch("caption");

  useEffect(() => {
    (async function (id: string) {
      try {
        const data = await postService.getSinglePostData(id);
        const normalizedData = {
          ...data,
          imageUrls: Array.isArray(data.imageUrls)
            ? data.imageUrls
            : data.imageUrl
            ? [data.imageUrl]
            : [],
        };
        setPostData(normalizedData);
      } catch (error) {
        console.log({ error });
      }
    })(id);
  }, [id]);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const textarea = document.getElementById(
      "caption-input"
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = caption || "";

    const newText = text.slice(0, start) + emojiData.emoji + text.slice(end);
    setValue("caption", newText);

    // Set cursor position after the inserted emoji
    setTimeout(() => {
      textarea.selectionStart = start + emojiData.emoji.length;
      textarea.selectionEnd = start + emojiData.emoji.length;
      textarea.focus();
    }, 0);

    setShowEmojiPicker(false);
  };

  const onSubmit: SubmitHandler<Input> = async (data) => {
    try {
      await toast.promise(
        postService.editPost(id, data.caption),
        {
          pending: "Editing post...",
          success: "Post edited successfully!",
          error: "Failed to edit post.",
        },
        toastOptions
      );
      router.push(`/post/${id}`);
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.length
        ? error.response.data
        : "Internal server error";
      toast.error(errorMessage, toastOptions);
    }
  };

  if (!postData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-400/30"></div>
          <div className="mt-4 text-gray-400 font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Edit Post
          </h1>
          <p className="mt-2 text-gray-500">Update your post's caption</p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Image Carousel */}
          <ImageCarousel images={postData.imageUrls} />

          {/* Form Section */}
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="relative">
                <div className="relative">
                  <textarea
                    id="caption-input"
                    {...register("caption", {
                      maxLength: {
                        value: 140,
                        message: "Caption should be less than 140 characters",
                      },
                    })}
                    defaultValue={postData.caption}
                    className="w-full min-h-[120px] p-4 pr-12 text-gray-700 bg-gray-50 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-200 resize-none"
                    placeholder="Write a caption for your post..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 bottom-3 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    <Smile className="w-6 h-6" />
                  </button>
                </div>

                {/* Emoji Picker Popover */}
                {showEmojiPicker && (
                  <div className="absolute right-0 bottom-full mb-2 z-50">
                    <div className="relative">
                      <div className="absolute -bottom-2 right-4 w-4 h-4 bg-white transform rotate-45" />
                      <EmojiPicker
                        onEmojiClick={onEmojiClick}
                        width={300}
                        height={400}
                      />
                    </div>
                  </div>
                )}

                {errors.caption && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.caption.message}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
