import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import postService from "@/utils/apiCalls/postService";
import PostPreview from "./PostPreview";
import { toastOptions } from "@/utils/toastOptions";

const reportTypes = [
  { value: "spam", label: "Spam", icon: "🚫" },
  { value: "abuse", label: "Abuse", icon: "⚠️" },
  { value: "harassment", label: "Harassment", icon: "😠" },
  { value: "misinformation", label: "Misinformation", icon: "❌" },
  { value: "inappropriate", label: "Inappropriate Content", icon: "🔞" },
  { value: "hate_speech", label: "Hate Speech", icon: "🚫" },
  { value: "violence", label: "Violence", icon: "⚔️" },
  { value: "self_harm", label: "Self-Harm", icon: "🆘" },
  {
    value: "intellectual_property_violation",
    label: "IP Violation",
    icon: "©️",
  },
  { value: "other", label: "Other", icon: "❓" },
];

type Input = {
  _id: string;
  reportType: string;
  reportDescription: string;
};

const ReportPost = () => {
  const { id } = useParams<{ id: string }>();
  const [postData, setPostData] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Add setValue to update values dynamically
  } = useForm<Input>({
    defaultValues: {
      reportType: "",
      reportDescription: "",
    },
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await postService.getSinglePostData(id);
        setPostData(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load post");
      }
    };
    fetchPost();
  }, [id]);

  const onSubmit: SubmitHandler<Input> = async (data) => {
    if (!data.reportType) {
      toast.error("Please select a report type", toastOptions);
      return;
    }

    const reportDescription =
      data.reportDescription.trim() || "No additional details provided.";

    try {
      await toast.promise(
        postService.reportEntity(
          "posts",
          id,
          data.reportType,
          reportDescription
        ),
        {
          pending: "Submitting report...",
          success: "Report submitted successfully",
          error: "Failed to submit report",
        }
      );
      router.push(`/post/${id}`);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong", toastOptions);
    }
  };

  if (!postData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-medium text-gray-900">Report Content</h1>
          <p className="mt-2 text-sm text-gray-500">
            Help us understand what's wrong with this post
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Post Preview */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-4">
          <PostPreview postData={postData} />
        </div>

        {/* Report Form */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                What's wrong with this post?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reportTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`
                      flex items-center p-4 rounded-lg border-2 cursor-pointer
                      transition-all duration-200 hover:bg-gray-50
                      ${
                        selectedType === type.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      {...register("reportType", {
                        required: "Please select a report type",
                      })}
                      value={type.value}
                      className="hidden"
                      onChange={(e) => {
                        setSelectedType(e.target.value);
                        setValue("reportType", e.target.value, {
                          shouldValidate: true,
                        }); // Ensure react-hook-form updates state
                      }}
                    />

                    <span className="mr-3 text-xl">{type.icon}</span>
                    <span className="text-sm font-medium text-gray-900">
                      {type.label}
                    </span>
                  </label>
                ))}
              </div>
              {errors.reportType && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.reportType.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Details
              </label>
              <textarea
                {...register("reportDescription", {
                  maxLength: {
                    value: 140,
                    message: "Description must be less than 140 characters",
                  },
                })}
                className="w-full h-32 px-4 py-3 rounded-lg border border-gray-200 
                          focus:ring-2 focus:ring-blue-500 focus:border-transparent
                          resize-none transition-all duration-200"
                placeholder="Please provide any additional context that will help us understand the issue..."
              />
              {errors.reportDescription && (
                <p className="mt-2 text-sm text-red-600">
                  {errors?.reportDescription?.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg
                         hover:bg-blue-700 focus:ring-4 focus:ring-blue-200
                         transition-all duration-200"
              >
                Submit Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPost;
