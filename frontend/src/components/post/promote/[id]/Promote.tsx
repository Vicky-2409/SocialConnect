"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import postService from "@/utils/apiCalls/postService";
import PayUComponent from "./PayUComponent";
import { IUser } from "@/types/types";
import {
  Sparkles,
  Star,
  TrendingUp,
  BarChart3,
  Target,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Post {
  _id: string;
  imageUrls: string[]; // Updated to array of strings
  caption: string;
}

const Promote = ({ currUserData }: { currUserData: IUser }) => {
  const { id } = useParams<{ id: string }>();
  const [postData, setPostData] = useState<null | Post>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getSinglePostData(id);
        setPostData(data);
      } catch (error) {
        console.log({ error });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const goToNextImage = () => {
    if (!postData?.imageUrls) return;
    setCurrentImageIndex((prev) =>
      prev === postData.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = () => {
    if (!postData?.imageUrls) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? postData.imageUrls.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-20 w-20 rounded-full bg-white/10 flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-purple-300 animate-spin" />
          </div>
          <div className="mt-6 text-purple-200 font-medium text-lg">
            Loading your masterpiece...
          </div>
        </div>
      </div>
    );
  }

  if (!postData) return null;

  const features = [
    {
      icon: TrendingUp,
      text: "Increased reach and visibility",
    },
    {
      icon: Target,
      text: "Targeted audience engagement",
    },
    {
      icon: Star,
      text: "Premium placement in feeds",
    },
    {
      icon: BarChart3,
      text: "Detailed performance analytics",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-fuchsia-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10">
          {/* Header */}
          <div className="p-8 md:p-10 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">
                  Boost Your Post
                </h1>
                <p className="text-lg text-purple-200/80">
                  Take your content to new heights
                </p>
              </div>
              <div className="relative">
                <div className="absolute -inset-1 bg-purple-500 rounded-full blur opacity-30 animate-pulse" />
                <Sparkles className="relative text-purple-300 h-10 w-10" />
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-10">
            {/* Post Preview with Carousel */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-white">Preview</h2>
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-purple-500/5 to-purple-500/10 p-1">
                <div className="relative rounded-xl overflow-hidden">
                  {/* Image Carousel */}
                  <div className="relative">
                    {/* Image with hover effect isolated to the image only */}
                    <div className="group overflow-hidden">
                      <Image
                        src={postData.imageUrls[currentImageIndex]}
                        width={600}
                        height={600}
                        alt={`Post preview ${currentImageIndex + 1}`}
                        className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Navigation Arrows - Moved outside the group hover effect */}
                    {postData.imageUrls.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToPrevImage();
                          }}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                        >
                          <ChevronLeft className="h-6 w-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            goToNextImage();
                          }}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors z-10"
                        >
                          <ChevronRight className="h-6 w-6" />
                        </button>
                      </>
                    )}

                    {/* Navigation Dots - Moved outside the group hover effect */}
                    {postData.imageUrls.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                        {postData.imageUrls.map((_, index) => (
                          <button
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              goToImage(index);
                            }}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50 hover:bg-white/70"
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-4 p-2">
                  <p className="text-gray-300 text-base leading-relaxed">
                    {postData.caption}
                  </p>
                </div>
              </div>
            </div>

            {/* Promotion Details */}
            <div className="space-y-6">
              <div className="bg-white/5 rounded-2xl p-8 backdrop-blur-lg border border-white/10">
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-white">
                      Premium Boost
                    </h3>
                    <p className="text-purple-200/80">
                      30 days of enhanced reach
                    </p>
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                    ₹1000
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-200 transition-transform duration-200 hover:translate-x-2"
                    >
                      <feature.icon className="w-5 h-5 mr-3 text-purple-400" />
                      {feature.text}
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  <PayUComponent currUserData={currUserData} postId={id} />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <p className="text-sm text-center text-purple-200/70">
                  Your boost will be activated immediately after successful
                  payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promote;
