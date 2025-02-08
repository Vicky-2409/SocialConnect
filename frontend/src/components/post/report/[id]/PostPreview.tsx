// import { IPost } from "@/types/types";
// import Image from "next/image";
// import React from "react";

// function PostPreview({ postData }: { postData: any }) {
//   const { profilePicUrl, username, firstName, lastName, caption, imageUrl } =
//     postData;

//   return (
//     <div className="bg-secColor mb-4 mt-2 shadow-lg rounded-lg">
//       <div className="flex justify-between items-center py-3 px-4">
//         <div className="flex items-center space-x-4">
//           <div className="relative w-12 h-12 cursor-pointer">
//             <Image
//               src={profilePicUrl}
//               alt="Profile Pic"
//               width={50}
//               height={50}
//               className="w-12 h-12 object-cover rounded-full"
//             />
//           </div>
//           <div>
//             <div className="flex items-center space-x-2">
//               <h3 className="text-black text-lg font-semibold cursor-pointer">
//                 {`${firstName} ${lastName}`}
//               </h3>
//             </div>
//             <p className="text-gray-400 text-sm cursor-pointer">@{username}</p>
//           </div>
//         </div>
//       </div>

//       {/* Caption Section */}
//       <p className="text-gray-800 px-4 py-2">{caption}</p>

//       {/* Post Image Section */}
//       {imageUrl && (
//         <div className="relative pb-11">
//           <Image
//             src={imageUrl}
//             alt="Post Image"
//             width={800}
//             height={800}
//             className="w-full h-[400px] object-contain cursor-pointer rounded-lg"
//             unoptimized
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// export default PostPreview;


























import { IPost } from "@/types/types";
import Image from "next/image";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function PostPreview({ postData }: { postData: any }) {
  const { profilePicUrl, username, firstName, lastName, caption, imageUrls } = postData;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? imageUrls.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="bg-secColor mb-4 mt-2 shadow-lg rounded-lg">
      <div className="flex justify-between items-center py-3 px-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-12 h-12 cursor-pointer">
            <Image
              src={profilePicUrl}
              alt="Profile Pic"
              width={50}
              height={50}
              className="w-12 h-12 object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-black text-lg font-semibold cursor-pointer">
                {`${firstName} ${lastName}`}
              </h3>
            </div>
            <p className="text-gray-400 text-sm cursor-pointer">@{username}</p>
          </div>
        </div>
      </div>
      
      {/* Caption Section */}
      <p className="text-gray-800 px-4 py-2">{caption}</p>
      
      {/* Image Carousel Section */}
      {imageUrls && imageUrls.length > 0 && (
        <div className="relative">
          <div className="relative h-[400px]">
            <Image
              src={imageUrls[currentImageIndex]}
              alt={`Post Image ${currentImageIndex + 1}`}
              width={800}
              height={800}
              className="w-full h-[400px] object-contain cursor-pointer rounded-lg"
              unoptimized
            />
            
            {/* Navigation Arrows */}
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={goToPrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={goToNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
          
          {/* Navigation Dots */}
          {imageUrls.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imageUrls.map((_:number, index:number) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PostPreview;