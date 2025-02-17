// // import React from 'react';
// // import { Share, Link, Facebook, MessageCircle, Mail, Twitter } from 'lucide-react';

// // const ShareModal = ({ isOpen, onClose, postId }) => {
// //   if (!isOpen) return null;

// //   const shareItems = [
// //     { id: 'copy', icon: Link, label: 'Copy link', onClick: () => navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`) },
// //     { id: 'facebook', icon: Facebook, label: 'Facebook', onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/post/${postId}`) },
// //     { id: 'messenger', icon: MessageCircle, label: 'Messenger', onClick: () => window.open(`fb-messenger://share/?link=${window.location.origin}/post/${postId}`) },
// //     { id: 'email', icon: Mail, label: 'Email', onClick: () => window.open(`mailto:?body=Check this out: ${window.location.origin}/post/${postId}`) },
// //     { id: 'twitter', icon: Twitter, label: 'X', onClick: () => window.open(`https://twitter.com/intent/tweet?url=${window.location.origin}/post/${postId}`) }
// //   ];

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
// //       <div className="bg-white rounded-lg w-[90%] max-w-md p-4">
// //         <div className="flex items-center justify-between mb-4">
// //           <h3 className="text-xl font-semibold">Share</h3>
// //           <button
// //             onClick={onClose}
// //             className="p-1 hover:bg-gray-100 rounded-full"
// //           >
// //             <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //               <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
// //             </svg>
// //           </button>
// //         </div>

// //         <div className="mb-6">
// //           <div className="relative">
// //             <input
// //               type="text"
// //               className="w-full px-4 py-2 bg-gray-100 rounded-lg"
// //               placeholder="Search"
// //             />
// //             <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
// //               <circle cx="11" cy="11" r="8" />
// //               <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
// //             </svg>
// //           </div>
// //         </div>

// //         <div className="grid grid-cols-4 gap-4 mb-8">
// //           {[1, 2, 3, 4].map((i) => (
// //             <div key={i} className="flex flex-col items-center">
// //               <div className="w-16 h-16 bg-gray-200 rounded-full mb-2">
// //                 <img src="/api/placeholder/64/64" alt="User" className="w-full h-full rounded-full object-cover" />
// //               </div>
// //               <span className="text-sm text-center">User {i}</span>
// //             </div>
// //           ))}
// //         </div>

// //         <div className="grid grid-cols-5 gap-4 mb-4">
// //           {shareItems.map(({ id, icon: Icon, label, onClick }) => (
// //             <button
// //               key={id}
// //               onClick={onClick}
// //               className="flex flex-col items-center gap-1"
// //             >
// //               <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200">
// //                 <Icon className="w-5 h-5" />
// //               </div>
// //               <span className="text-xs text-gray-600">{label}</span>
// //             </button>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ShareModal;

// // import React, { useState, useEffect, useRef } from 'react';
// // import { Share, Link, Facebook, MessageCircle, Mail, Twitter, Search, X, Loader2 } from 'lucide-react';
// // import userService from '@/utils/apiCalls/userService';

// // interface User {
// //   _id: string;
// //   username: string;
// //   firstName: string;
// //   lastName: string;
// //   profilePicUrl: string;
// // }

// // interface ShareModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   postId: string;
// // }

// // const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, postId }) => {
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [searchResults, setSearchResults] = useState<User[]>([]);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// //   const shareItems = [
// //     {
// //       id: 'copy',
// //       icon: Link,
// //       label: 'Copy link',
// //       onClick: async () => {
// //         try {
// //           await navigator.clipboard.writeText(`${window.location.origin}/post/${postId}`);
// //           // You could add a toast notification here
// //         } catch (err) {
// //           console.error('Failed to copy:', err);
// //         }
// //       }
// //     },
// //     {
// //       id: 'facebook',
// //       icon: Facebook,
// //       label: 'Facebook',
// //       onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.origin}/post/${postId}`)
// //     },
// //     {
// //       id: 'messenger',
// //       icon: MessageCircle,
// //       label: 'Messenger',
// //       onClick: () => window.open(`fb-messenger://share/?link=${window.location.origin}/post/${postId}`)
// //     },
// //     {
// //       id: 'email',
// //       icon: Mail,
// //       label: 'Email',
// //       onClick: () => window.open(`mailto:?body=Check this out: ${window.location.origin}/post/${postId}`)
// //     },
// //     {
// //       id: 'twitter',
// //       icon: Twitter,
// //       label: 'X',
// //       onClick: () => window.open(`https://twitter.com/intent/tweet?url=${window.location.origin}/post/${postId}`)
// //     }
// //   ];

// //   useEffect(() => {
// //     if (debounceTimeoutRef.current) {
// //       clearTimeout(debounceTimeoutRef.current);
// //     }

// //     if (searchQuery.trim()) {
// //       setIsLoading(true);
// //       debounceTimeoutRef.current = setTimeout(() => {
// //         handleSearch();
// //       }, 300);
// //     } else {
// //       setSearchResults([]);
// //       setIsLoading(false);
// //     }

// //     return () => {
// //       if (debounceTimeoutRef.current) {
// //         clearTimeout(debounceTimeoutRef.current);
// //       }
// //     };
// //   }, [searchQuery]);

// //   const handleSearch = async () => {
// //     try {
// //       const results = await userService.searchUsers(searchQuery);
// //       setSearchResults(results);
// //     } catch (error) {
// //       console.error('Search error:', error);
// //       setSearchResults([]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   if (!isOpen) return null;

// //   const handleSendToUser = async (userId: string) => {
// //     try {
// //       // Implement your send to user logic here
// //       console.log(`Sending post ${postId} to user ${userId}`);
// //       // You could add a toast notification here
// //     } catch (error) {
// //       console.error('Error sending post:', error);
// //     }
// //   };

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
// //       <div className="bg-white dark:bg-gray-800 rounded-lg w-[90%] max-w-md p-4 max-h-[90vh] overflow-y-auto">
// //         <div className="flex items-center justify-between mb-4">
// //           <h3 className="text-xl font-semibold dark:text-white">Share</h3>
// //           <button
// //             onClick={onClose}
// //             className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
// //           >
// //             <X className="w-6 h-6 dark:text-white" />
// //           </button>
// //         </div>

// //         <div className="mb-6">
// //           <div className="relative">
// //             <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
// //             <input
// //               type="text"
// //               className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl
// //                        text-gray-900 dark:text-gray-100 placeholder-gray-500
// //                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
// //               placeholder="Search users..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //             />
// //           </div>
// //         </div>

// //         {isLoading ? (
// //           <div className="flex justify-center py-4">
// //             <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
// //           </div>
// //         ) : searchQuery && searchResults.length > 0 ? (
// //           <div className="mb-6 space-y-2">
// //             {searchResults.map((user) => (
// //               <div
// //                 key={user._id}
// //                 className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
// //                 onClick={() => handleSendToUser(user._id)}
// //               >
// //                 <div className="flex items-center space-x-3">
// //                   <img
// //                     src={user.profilePicUrl || "/api/placeholder/40/40"}
// //                     alt={user.username}
// //                     className="w-10 h-10 rounded-full object-cover"
// //                   />
// //                   <div>
// //                     <p className="font-medium dark:text-white">{user.firstName} {user.lastName}</p>
// //                     <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         ) : searchQuery ? (
// //           <div className="text-center py-4 text-gray-500 dark:text-gray-400">
// //             No users found
// //           </div>
// //         ) : null}

// //         <div className="grid grid-cols-5 gap-4 mb-4">
// //           {shareItems.map(({ id, icon: Icon, label, onClick }) => (
// //             <button
// //               key={id}
// //               onClick={onClick}
// //               className="flex flex-col items-center gap-1"
// //             >
// //               <div className="w-12 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full
// //                            hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
// //                 <Icon className="w-5 h-5 dark:text-white" />
// //               </div>
// //               <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
// //             </button>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ShareModal;

// // import React, { useState, useEffect, useRef } from "react";
// // import { Search, X } from "lucide-react";
// // import userService from "@/utils/apiCalls/userService";
// // import Image from "next/image";
// // import messageService from "@/utils/apiCalls/messageService";
// // import { IUser } from "@/types/types";

// // interface User {
// //   _id: string;
// //   username: string;
// //   firstName: string;
// //   lastName: string;
// //   profilePicUrl: string;
// // }

// // interface ShareModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   postId: string;
// // }

// // const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, postId }) => {
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [searchResults, setSearchResults] = useState<User[]>([]);
// //   const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
// //   const [message, setMessage] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// //   useEffect(() => {
// //     if (debounceTimeoutRef.current) {
// //       clearTimeout(debounceTimeoutRef.current);
// //     }

// //     if (searchQuery.trim()) {
// //       setIsLoading(true);
// //       debounceTimeoutRef.current = setTimeout(() => {
// //         handleSearch();
// //       }, 300);
// //     } else {
// //       setSearchResults([]);
// //       setIsLoading(false);
// //     }

// //     return () => {
// //       if (debounceTimeoutRef.current) {
// //         clearTimeout(debounceTimeoutRef.current);
// //       }
// //     };
// //   }, [searchQuery]);

// //   const handleSearch = async () => {
// //     try {
// //       const results = await userService.searchUsers(searchQuery);
// //       setSearchResults(results);
// //     } catch (error) {
// //       console.error("Search error:", error);
// //       setSearchResults([]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const toggleUserSelection = (user: User) => {
// //     setSelectedUsers((prev) => {
// //       const isSelected = prev.some((u) => u._id === user._id);
// //       if (isSelected) {
// //         return prev.filter((u) => u._id !== user._id);
// //       } else {
// //         return [...prev, user];
// //       }
// //     });
// //   };

// //   const handleSend = async () => {
// //     try {
// //       // Implement your send logic here
// //       // For each selected user, send the post and message
// //       for (const user of selectedUsers) {
// //         await sendPostToUser(user);
// //       }
// //       onClose();
// //       // Add success toast notification here
// //     } catch (error) {
// //       console.error("Error sending post:", error);
// //       // Add error toast notification here
// //     }
// //   };

// //   const sendPostToUser = async (user: any) => {
// //     // Implement your API call to send post as message
// //     const formData = new FormData();
// //     formData.append("message", message);
// //     formData.append("attachment", postId);
// //     const { _id } = await messageService.createConversation(user._id);

// //     await messageService.sendMessage(_id, formData);
// //     console.log(formData);
    
// //     console.log(
// //       `Sending post ${postId} to user ${user._id} with message: ${formData}`
// //     );
// //   };

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
// //       <div className="bg-white rounded-xl w-[90%] max-w-md overflow-hidden">
// //         {/* Header */}
// //         <div className="flex items-center justify-between p-4 border-b">
// //           <button onClick={onClose} className="p-1">
// //             <X className="w-6 h-6" />
// //           </button>
// //           <h3 className="text-lg font-semibold">Share</h3>
// //           <div className="w-6" /> {/* Spacer for centering */}
// //         </div>

// //         {/* Search Input */}
// //         <div className="p-4 border-b">
// //           <div className="relative">
// //             <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
// //             <input
// //               type="text"
// //               className="w-full pl-10 pr-8 py-2 bg-gray-100 rounded-lg 
// //                        text-gray-900 placeholder-gray-500 
// //                        focus:outline-none focus:ring-1 focus:ring-gray-200"
// //               placeholder="Search..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //             />
// //             {searchQuery && (
// //               <button
// //                 onClick={() => setSearchQuery("")}
// //                 className="absolute right-3 top-1/2 -translate-y-1/2"
// //               >
// //                 <X className="w-4 h-4 text-gray-400" />
// //               </button>
// //             )}
// //           </div>
// //         </div>

// //         {/* Results List */}
// //         <div className="max-h-[300px] overflow-y-auto">
// //           {searchResults.map((user) => (
// //             <div
// //               key={user._id}
// //               className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
// //               onClick={() => toggleUserSelection(user)}
// //             >
// //               <div className="flex items-center space-x-3">
// //                 <div className="relative w-12 h-12">
// //                   <Image
// //                     src={user.profilePicUrl || "/api/placeholder/48/48"}
// //                     alt={user.username}
// //                     fill
// //                     className="rounded-full object-cover"
// //                   />
// //                 </div>
// //                 <div>
// //                   <p className="font-medium">{user.username}</p>
// //                   <p className="text-sm text-gray-500">
// //                     {user.firstName} {user.lastName}
// //                   </p>
// //                 </div>
// //               </div>
// //               <div
// //                 className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
// //                             ${
// //                               selectedUsers.some((u) => u._id === user._id)
// //                                 ? "border-blue-500 bg-blue-500"
// //                                 : "border-gray-300"
// //                             }`}
// //               >
// //                 {selectedUsers.some((u) => u._id === user._id) && (
// //                   <svg
// //                     className="w-3 h-3 text-white"
// //                     fill="none"
// //                     viewBox="0 0 24 24"
// //                     stroke="currentColor"
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       strokeWidth={2}
// //                       d="M5 13l4 4L19 7"
// //                     />
// //                   </svg>
// //                 )}
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Message Input */}
// //         <div className="p-4 border-t">
// //           <input
// //             type="text"
// //             className="w-full p-2 border rounded-lg 
// //                      text-gray-900 placeholder-gray-500 
// //                      focus:outline-none focus:ring-1 focus:ring-gray-200"
// //             placeholder="Write a message..."
// //             value={message}
// //             onChange={(e) => setMessage(e.target.value)}
// //           />
// //         </div>

// //         {/* Send Button */}
// //         <div className="p-4 border-t">
// //           <button
// //             onClick={handleSend}
// //             disabled={selectedUsers.length === 0}
// //             className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg
// //                      disabled:bg-blue-300 disabled:cursor-not-allowed
// //                      hover:bg-blue-600 transition-colors"
// //           >
// //             Send
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ShareModal;















































// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Search, X } from "lucide-react";
// import userService from "@/utils/apiCalls/userService";
// import messageService from "@/utils/apiCalls/messageService";
// import Image from "next/image";
// import { IPost } from "@/types/types";

// interface User {
//   _id: string;
//   username: string;
//   firstName: string;
//   lastName: string;
//   profilePicUrl: string;
// }

// interface ShareModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   post: IPost;
// }

// const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<User[]>([]);
//   const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Debounced search function
//   const handleSearch = useCallback(async () => {
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       setIsLoading(false);
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const results = await userService.searchUsers(searchQuery);
//       setSearchResults(results);
//     } catch (error) {
//       console.error("Search error:", error);
//       setSearchResults([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [searchQuery]);

//   useEffect(() => {
//     if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    
//     debounceTimeoutRef.current = setTimeout(() => {
//       handleSearch();
//     }, 300);

//     return () => {
//       if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
//     };
//   }, [searchQuery, handleSearch]);

//   // Toggle user selection
//   const toggleUserSelection = (user: User) => {
//     setSelectedUsers((prev) =>
//       prev.some((u) => u._id === user._id)
//         ? prev.filter((u) => u._id !== user._id)
//         : [...prev, user]
//     );
//   };

//   // Send post to selected users
//   const handleSend = async () => {
//     try {
//       await Promise.all(selectedUsers.map(sendPostToUser));
//       onClose();
//       // Add success notification here
//     } catch (error) {
//       console.error("Error sending post:", error);
//       // Add error notification here
//     }
//   };

//   const sendPostToUser = async (user: User) => {
//     const formData = new FormData();
//     formData.append("postId", post._id);
//     formData.append("postImageUrl",post.imageUrls[0])
//     const { _id } = await messageService.createConversation(user._id);
//     await messageService.sendMessage(_id, formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//       <div className="bg-white rounded-xl w-[90%] max-w-md overflow-hidden">
        
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <button onClick={onClose} className="p-1">
//             <X className="w-6 h-6" />
//           </button>
//           <h3 className="text-lg font-semibold">Share</h3>
//           <div className="w-6" /> {/* Spacer for centering */}
//         </div>

//         {/* Search Input */}
//         <div className="p-4 border-b">
//           <div className="relative">
//             <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               className="w-full pl-10 pr-8 py-2 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-200"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery("")}
//                 className="absolute right-3 top-1/2 -translate-y-1/2"
//               >
//                 <X className="w-4 h-4 text-gray-400" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Search Results */}
//         <div className="max-h-[300px] overflow-y-auto">
//           {isLoading ? (
//             <p className="p-4 text-center text-gray-500">Searching...</p>
//           ) : searchResults.length > 0 ? (
//             searchResults.map((user) => (
//               <div
//                 key={user._id}
//                 className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
//                 onClick={() => toggleUserSelection(user)}
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="relative w-12 h-12">
//                     <Image
//                       src={user.profilePicUrl || "/api/placeholder/48/48"}
//                       alt={user.username}
//                       fill
//                       className="rounded-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <p className="font-medium">{user.username}</p>
//                     <p className="text-sm text-gray-500">
//                       {user.firstName} {user.lastName}
//                     </p>
//                   </div>
//                 </div>
//                 <div
//                   className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
//                   ${selectedUsers.some((u) => u._id === user._id) ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}
//                 >
//                   {selectedUsers.some((u) => u._id === user._id) && (
//                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="p-4 text-center text-gray-500">No users found.</p>
//           )}
//         </div>


//         {/* Send Button */}
//         <div className="p-4 border-t">
//           <button
//             onClick={handleSend}
//             disabled={selectedUsers.length === 0}
//             className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShareModal;










































// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Search, X } from "lucide-react";
// import userService from "@/utils/apiCalls/userService";
// import messageService from "@/utils/apiCalls/messageService";
// import Image from "next/image";
// import { IPost } from "@/types/types";

// interface User {
//   _id: string;
//   username: string;
//   firstName: string;
//   lastName: string;
//   profilePicUrl: string;
// }

// interface ShareModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   post: IPost;
// }

// const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post }) => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [searchResults, setSearchResults] = useState<User[]>([]);
//   const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSending, setIsSending] = useState(false);
  
//   const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

//   // Reset states when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setSearchQuery("");
//       setSearchResults([]);
//       setSelectedUsers([]);
//       setIsLoading(false);
//       setIsSending(false);
//     }
//   }, [isOpen]);

//   const handleSearch = useCallback(async () => {
//     if (!searchQuery.trim()) {
//       setSearchResults([]);
//       setIsLoading(false);
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const results = await userService.searchUsers(searchQuery);
//       setSearchResults(results);
//     } catch (error) {
//       console.error("Search error:", error);
//       setSearchResults([]);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [searchQuery]);

//   useEffect(() => {
//     if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    
//     debounceTimeoutRef.current = setTimeout(() => {
//       handleSearch();
//     }, 300);

//     return () => {
//       if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
//     };
//   }, [searchQuery, handleSearch]);

//   const toggleUserSelection = (user: User) => {
//     setSelectedUsers((prev) =>
//       prev.some((u) => u._id === user._id)
//         ? prev.filter((u) => u._id !== user._id)
//         : [...prev, user]
//     );
//   };

//   const handleSend = async () => {
//     setIsSending(true);
//     try {
//       await Promise.all(selectedUsers.map(sendPostToUser));
//       // Reset states after successful send
//       setSearchQuery("");
//       setSearchResults([]);
//       setSelectedUsers([]);
//       onClose();
//       // Add success notification here
//     } catch (error) {
//       console.error("Error sending post:", error);
//       // Add error notification here
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const sendPostToUser = async (user: User) => {
//     const formData = new FormData();
//     formData.append("postId", post._id);
//     formData.append("postImageUrl", post.imageUrls[0]);
//     const { _id } = await messageService.createConversation(user._id);
//     await messageService.sendMessage(_id, formData);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-x-0 top-60 z-50 flex justify-center mt-4 px-4 animate-slideDown">
//       <div className="bg-white rounded-xl w-full max-w-md overflow-hidden shadow-lg">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b">
//           <button onClick={onClose} className="p-1">
//             <X className="w-6 h-6" />
//           </button>
//           <h3 className="text-lg font-semibold">Share</h3>
//           <div className="w-6" />
//         </div>

//         {/* Search Input */}
//         <div className="p-4 border-b">
//           <div className="relative">
//             <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input
//               type="text"
//               className="w-full pl-10 pr-8 py-2 bg-gray-100 rounded-lg text-gray-900 
//                        placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-200"
//               placeholder="Search..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//             {searchQuery && (
//               <button
//                 onClick={() => setSearchQuery("")}
//                 className="absolute right-3 top-1/2 -translate-y-1/2"
//               >
//                 <X className="w-4 h-4 text-gray-400" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Search Results */}
//         <div className="max-h-[300px] overflow-y-auto">
//           {isLoading ? (
//             <p className="p-4 text-center text-gray-500">Searching...</p>
//           ) : searchResults.length > 0 ? (
//             searchResults.map((user) => (
//               <div
//                 key={user._id}
//                 className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
//                 onClick={() => toggleUserSelection(user)}
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="relative w-12 h-12">
//                     <Image
//                       src={user.profilePicUrl || "/api/placeholder/48/48"}
//                       alt={user.username}
//                       fill
//                       className="rounded-full object-cover"
//                     />
//                   </div>
//                   <div>
//                     <p className="font-medium">{user.username}</p>
//                     <p className="text-sm text-gray-500">
//                       {user.firstName} {user.lastName}
//                     </p>
//                   </div>
//                 </div>
//                 <div
//                   className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
//                   ${selectedUsers.some((u) => u._id === user._id) 
//                     ? "border-blue-500 bg-blue-500" 
//                     : "border-gray-300"
//                   }`}
//                 >
//                   {selectedUsers.some((u) => u._id === user._id) && (
//                     <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                     </svg>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : searchQuery ? (
//             <p className="p-4 text-center text-gray-500">No users found.</p>
//           ) : null}
//         </div>

//         {/* Send Button */}
//         <div className="p-4 border-t">
//           <button
//             onClick={handleSend}
//             disabled={selectedUsers.length === 0 || isSending}
//             className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg 
//                      disabled:bg-blue-300 disabled:cursor-not-allowed 
//                      hover:bg-blue-600 transition-colors"
//           >
//             {isSending ? "Sending..." : "Send"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShareModal;






























import React, { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import userService from "@/utils/apiCalls/userService";
import messageService from "@/utils/apiCalls/messageService";
import Image from "next/image";
import { IPost } from "@/types/types";

interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  profilePicUrl: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: IPost;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUsers([]);
      setIsLoading(false);
      setIsSending(false);
    }
  }, [isOpen]);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const results = await userService.searchUsers(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    
    debounceTimeoutRef.current = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => {
      if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
    };
  }, [searchQuery, handleSearch]);

  const toggleUserSelection = (user: User) => {
    setSelectedUsers((prev) =>
      prev.some((u) => u._id === user._id)
        ? prev.filter((u) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      await Promise.all(selectedUsers.map(sendPostToUser));
      setSearchQuery("");
      setSearchResults([]);
      setSelectedUsers([]);
      onClose();
    } catch (error) {
      console.error("Error sending post:", error);
    } finally {
      setIsSending(false);
    }
  };

  const sendPostToUser = async (user: User) => {
    const formData = new FormData();
    formData.append("postId", post._id);
    formData.append("postImageUrl", post.imageUrls[0]);
    const { _id } = await messageService.createConversation(user._id);
    await messageService.sendMessage(_id, formData);
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 flex items-center justify-center ">
      <div className="bg-white rounded-xl w-full max-w-md m-4 overflow-hidden shadow-lg animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button onClick={onClose} className="p-1">
            <X className="w-6 h-6" />
          </button>
          <h3 className="text-lg font-semibold">Share</h3>
          <div className="w-6" />
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="w-full pl-10 pr-8 py-2 bg-gray-100 rounded-lg text-gray-900 
                       placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-200"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-64 overflow-y-auto">
          {isLoading ? (
            <p className="p-4 text-center text-gray-500">Searching...</p>
          ) : searchResults.length > 0 ? (
            searchResults.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => toggleUserSelection(user)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative w-12 h-12">
                    <Image
                      src={user.profilePicUrl || "/api/placeholder/48/48"}
                      alt={user.username}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{user.username}</p>
                    <p className="text-sm text-gray-500">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                  ${selectedUsers.some((u) => u._id === user._id) 
                    ? "border-blue-500 bg-blue-500" 
                    : "border-gray-300"
                  }`}
                >
                  {selectedUsers.some((u) => u._id === user._id) && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            ))
          ) : searchQuery ? (
            <p className="p-4 text-center text-gray-500">No users found.</p>
          ) : null}
        </div>

        {/* Send Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleSend}
            disabled={selectedUsers.length === 0 || isSending}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg 
                     disabled:bg-blue-300 disabled:cursor-not-allowed 
                     hover:bg-blue-600 transition-colors"
          >
            {isSending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;