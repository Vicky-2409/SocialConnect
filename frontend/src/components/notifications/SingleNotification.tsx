// import { formatDate } from "@/utils/formatString";
// import Image from "next/image";
// import React from "react";

// type Props = {
//   username: string;
//   firstName: string;
//   lastName: string;
//   profilePicUrl: string;
//   notificationMessage: string;
//   entityType: "posts" | "users";
//   entityId: any;
//   updatedAt: string;
// };

// function SingleNotification({
//   username,
//   firstName,
//   lastName,
//   profilePicUrl,
//   notificationMessage,
//   entityType,
//   entityId,
//   updatedAt,
// }: Props) {
//   const timestamp = formatDate(updatedAt);
//   const imageUrl = entityType === "posts" ? entityId.imageUrl : null;
//   const isRestricted =
//     notificationMessage === "You are restricted for posting content for 7 days";
//   const link =
//     entityType === "posts" ? `/post/${entityId._id}` : `/profile/${username}`;

//   return (
//     <a
//       href={link}
//       className={`group block w-full rounded-xl p-4 transition-all duration-300 hover:bg-gray-50 ${
//         isRestricted
//           ? "bg-red-50 hover:bg-red-100 border border-red-200"
//           : "bg-white hover:shadow-md"
//       }`}
//     >
//       <div className="flex items-start gap-4">
//         {/* Profile Picture with hover effect */}
//         <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
//           <div
//             className={`absolute -inset-0.5 rounded-full blur opacity-50 transition-opacity duration-300 ${
//               isRestricted ? "bg-red-400" : "bg-blue-400 group-hover:opacity-75"
//             }`}
//           />
//           <Image
//             src={profilePicUrl}
//             alt={`${firstName}'s Profile Picture`}
//             width={48}
//             height={48}
//             className="relative rounded-full object-cover ring-2 ring-white"
//           />
//         </div>

//         {/* Content */}
//         <div className="flex-grow min-w-0">
//           <div className="flex items-start justify-between gap-2">
//             <div>
//               <p className="font-medium text-gray-900 truncate">
//                 {`${firstName} ${lastName}`}
//               </p>
//               <p
//                 className={`mt-1 text-sm ${
//                   isRestricted ? "text-red-600 font-medium" : "text-gray-600"
//                 }`}
//               >
//                 {notificationMessage}
//               </p>
//             </div>
//             <span className="flex-shrink-0 text-xs text-gray-500">
//               {timestamp}
//             </span>
//           </div>
//         </div>

//         {/* Post Preview Image */}
//         {imageUrl && (
//           <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
//             <Image
//               src={imageUrl}
//               alt="Post Preview"
//               width={56}
//               height={56}
//               className="rounded-lg object-cover ring-1 ring-gray-200"
//               unoptimized
//             />
//           </div>
//         )}
//       </div>

//       {/* Restricted Warning Icon */}
//       {isRestricted && (
//         <div className="mt-2 flex items-center gap-2 text-red-600 text-xs">
//           <svg
//             className="w-4 h-4"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//             />
//           </svg>
//           <span className="font-medium">Account Restricted</span>
//         </div>
//       )}
//     </a>
//   );
// }

// export default SingleNotification;






























import { formatDate } from "@/utils/formatString";
import Image from "next/image";
import React from "react";

type NotificationType = "posts" | "users" | "restricted" | "rejected" | "approved";

interface Entity {
  _id: string;
  imageUrl?: string;
}

type Props = {
  username: string;
  firstName: string;
  lastName: string;
  profilePicUrl: string;
  notificationMessage: string;
  entityType: NotificationType;
  entityId: Entity;
  updatedAt: string;
};

function SingleNotification({
  username,
  firstName,
  lastName,
  profilePicUrl,
  notificationMessage,
  entityType,
  entityId,
  updatedAt,
}: Props) {
  const timestamp = formatDate(updatedAt);
  const imageUrl = entityType === "posts" ? entityId.imageUrl : null;

  // Define notification states
  const isRestricted = notificationMessage === "You are restricted for posting content for 7 days";
  const isRejected = notificationMessage === "Your request has been rejected since the proof was not enough!";
  const isApproved = notificationMessage === "Yay! Your request was accepted and you have approved with a WeNet-Tick !";

  // Determine link based on notification type
  const getLink = () => {
    if (isRejected || isApproved) {
      return "/settings?settingNameQuery=accountType";
    }
    return entityType === "posts" ? `/post/${entityId._id}` : `/profile/${username}`;
  };

  // Get style classes based on notification type
  const getNotificationStyles = () => {
    if (isRestricted) {
      return {
        container: "bg-red-50 hover:bg-red-100 border border-red-200",
        text: "text-red-600 font-medium",
        glow: "bg-red-400"
      };
    }
    if (isApproved) {
      return {
        container: "bg-green-50 hover:bg-green-100 border border-green-200",
        text: "text-green-600 font-medium",
        glow: "bg-green-400"
      };
    }
    if (isRejected) {
      return {
        container: "bg-yellow-50 hover:bg-yellow-100 border border-yellow-200",
        text: "text-yellow-600 font-medium",
        glow: "bg-yellow-400"
      };
    }
    return {
      container: "bg-white hover:shadow-md",
      text: "text-gray-600",
      glow: "bg-blue-400 group-hover:opacity-75"
    };
  };

  const styles = getNotificationStyles();

  return (
    <a
      href={getLink()}
      className={`group block w-full rounded-xl p-4 transition-all duration-300 hover:bg-gray-50 ${styles.container}`}
      aria-label={`Notification from ${firstName} ${lastName}: ${notificationMessage}`}
    >
      <div className="flex items-start gap-4">
        {/* Profile Picture with hover effect */}
        <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
          <div
            className={`absolute -inset-0.5 rounded-full blur opacity-50 transition-opacity duration-300 ${styles.glow}`}
            aria-hidden="true"
          />
          <Image
            src={profilePicUrl}
            alt={`${firstName}'s Profile Picture`}
            width={48}
            height={48}
            className="relative rounded-full object-cover ring-2 ring-white"
            priority={isRestricted}
          />
        </div>

        {/* Content */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-gray-900 truncate">
                {`${firstName} ${lastName}`}
              </p>
              <p className={`mt-1 text-sm ${styles.text}`}>
                {notificationMessage}
              </p>
            </div>
            <time 
              dateTime={updatedAt} 
              className="flex-shrink-0 text-xs text-gray-500"
            >
              {timestamp}
            </time>
          </div>
        </div>

        {/* Post Preview Image */}
        {imageUrl && (
          <div className="flex-shrink-0 relative group-hover:scale-105 transition-transform duration-300">
            <Image
              src={imageUrl}
              alt="Post Preview"
              width={56}
              height={56}
              className="rounded-lg object-cover ring-1 ring-gray-200"
              unoptimized
            />
          </div>
        )}
      </div>

      {/* Status Icons */}
      {(isRestricted || isRejected || isApproved) && (
        <div className={`mt-2 flex items-center gap-2 ${styles.text}`} role="alert">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {isRestricted && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            )}
            {isApproved && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
            {isRejected && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
          <span className="font-medium">
            {isRestricted && "Account Restricted"}
            {isApproved && "Request Approved"}
            {isRejected && "Request Rejected"}
          </span>
        </div>
      )}
    </a>
  );
}

export default SingleNotification;