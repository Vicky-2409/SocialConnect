// "use client";
// import React, { useState, createRef, ChangeEvent, FormEvent } from "react";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import { Bounce, ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Box,
//   Button,
//   Container,
//   Paper,
//   Typography,
//   IconButton,
//   useTheme,
//   useMediaQuery,
//   CircularProgress,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import postService from "@/utils/apiCalls/postService";

// // File validation constants
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const MAX_DIMENSION = 4096;
// const TARGET_FILE_SIZE = 1 * 1024 * 1024; // 1MB target for compression

// interface CropImageProps {
//   setIsCaptionPage: (value: boolean) => void;
//   setPostData: (data: any) => void;
// }

// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });

// const DropZone = styled(Paper)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: theme.spacing(4),
//   backgroundColor: theme.palette.grey[50],
//   border: `2px dashed ${theme.palette.grey[300]}`,
//   borderRadius: theme.shape.borderRadius,
//   cursor: "pointer",
//   transition: "all 0.3s ease-in-out",
//   "&:hover": {
//     backgroundColor: theme.palette.grey[100],
//     borderColor: theme.palette.primary.main,
//   },
//   minHeight: 300,
// }));

// function CropImage({ setIsCaptionPage, setPostData }: CropImageProps) {
//   const [image, setImage] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const cropperRef = createRef<any>();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const validateFile = (file: File): string | null => {
//     if (!ALLOWED_TYPES.includes(file.type)) {
//       return "Please upload a valid image file (JPEG, PNG, or WebP)";
//     }
//     if (file.size > MAX_FILE_SIZE) {
//       return "File size exceeds 10MB limit";
//     }
//     return null;
//   };

//   const compressImage = async (file: File): Promise<Blob> => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.src = URL.createObjectURL(file);

//       img.onload = () => {
//         URL.revokeObjectURL(img.src);

//         const canvas = document.createElement("canvas");
//         let width = img.width;
//         let height = img.height;

//         // Scale down if dimensions exceed max
//         if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
//           const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
//           width *= ratio;
//           height *= ratio;
//         }

//         canvas.width = width;
//         canvas.height = height;

//         const ctx = canvas.getContext("2d");
//         if (!ctx) {
//           reject(new Error("Failed to get canvas context"));
//           return;
//         }

//         ctx.drawImage(img, 0, 0, width, height);

//         // Start with high quality
//         let quality = 0.9;
//         const compressFile = () => {
//           canvas.toBlob(
//             (blob) => {
//               if (!blob) {
//                 reject(new Error("Failed to compress image"));
//                 return;
//               }
//               if (blob.size <= TARGET_FILE_SIZE || quality <= 0.3) {
//                 resolve(blob);
//               } else {
//                 quality -= 0.1;
//                 compressFile();
//               }
//             },
//             file.type,
//             quality
//           );
//         };

//         compressFile();
//       };

//       img.onerror = () => reject(new Error("Failed to load image"));
//     });
//   };

//   const processFile = async (file: File): Promise<void> => {
//     const error = validateFile(file);
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const compressedFile = await compressImage(file);
//       const reader = new FileReader();
//       reader.onload = () => {
//         setImage(reader.result as string);
//         setIsLoading(false);
//       };
//       reader.readAsDataURL(compressedFile);
//     } catch (error) {
//       console.error("Image processing failed:", error);
//       toast.error("Failed to process image. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files[0]) {
//       await processFile(files[0]);
//     }
//   };

//   const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     if (files && files[0]) {
//       await processFile(files[0]);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const dataURLtoBlob = async (dataURL: string): Promise<Blob> => {
//     const res = await fetch(dataURL);
//     return await res.blob();
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!cropperRef.current?.cropper) return;

//     setIsLoading(true);
//     try {
//       const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
//       const croppedBlob = await new Promise<Blob>((resolve) => {
//         croppedCanvas.toBlob((blob: any) => resolve(blob!), "image/jpeg", 0.9);
//       });

//       const formData = new FormData();
//       formData.append("image", croppedBlob, "croppedImage.jpg");

//       const res = await toast.promise(postService.createPostImage(formData), {
//         pending: "Creating your post...",
//         success: "Ready to add your caption!",
//         error: "Couldn't upload image. Please try again.",
//       });

//       setPostData(res?.data.postData);
//       setIsCaptionPage(true);
//     } catch (error) {
//       console.error("Upload error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 4,
//           py: 4,
//         }}
//       >
//         <ToastContainer />

//         <Typography variant="h4" component="h1" align="center" gutterBottom>
//           Create New Post
//         </Typography>

//         {isLoading ? (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             minHeight={300}
//           >
//             <CircularProgress />
//           </Box>
//         ) : image ? (
//           <Paper
//             elevation={2}
//             sx={{
//               p: 2,
//               backgroundColor: "white",
//               borderRadius: 2,
//               overflow: "hidden",
//             }}
//           >
//             <Cropper
//               ref={cropperRef}
//               style={{
//                 height: isMobile ? 300 : 400,
//                 width: "100%",
//               }}
//               initialAspectRatio={1}
//               preview=".img-preview"
//               src={image}
//               viewMode={1}
//               minCropBoxHeight={10}
//               minCropBoxWidth={10}
//               background={false}
//               responsive={true}
//               autoCropArea={1}
//               checkOrientation={false}
//               guides={true}
//               aspectRatio={1}
//             />
//           </Paper>
//         ) : (
//           <DropZone onDragOver={handleDragOver} onDrop={handleDrop}>
//             <IconButton color="primary" sx={{ mb: 2, width: 80, height: 80 }}>
//               <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
//             </IconButton>
//             <Typography variant="h6" color="textSecondary" align="center">
//               Drag and drop your image here
//             </Typography>
//             <Typography variant="body2" color="textSecondary" align="center">
//               or
//             </Typography>
//             <Button
//               component="label"
//               variant="contained"
//               startIcon={<CloudUploadIcon />}
//               sx={{ mt: 2 }}
//               disabled={isLoading}
//             >
//               Choose File
//               <VisuallyHiddenInput
//                 type="file"
//                 onChange={handleImageUpload}
//                 accept={ALLOWED_TYPES.join(",")}
//               />
//             </Button>
//           </DropZone>
//         )}

//         {image && (
//           <Box sx={{ display: "flex", justifyContent: "center" }}>
//             <Button
//               type="submit"
//               variant="contained"
//               size="large"
//               disabled={isLoading}
//               sx={{
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontSize: "1.1rem",
//               }}
//             >
//               {isLoading ? <CircularProgress size={24} /> : "Continue"}
//             </Button>
//           </Box>
//         )}
//       </Box>
//     </Container>
//   );
// }

// export default CropImage;

// "use client";
// import React, { useState, createRef, ChangeEvent, FormEvent } from "react";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import { Bounce, ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import {
//   Box,
//   Button,
//   Container,
//   Paper,
//   Typography,
//   IconButton,
//   useTheme,
//   useMediaQuery,
//   CircularProgress,
//   ImageList,
//   ImageListItem,
//   Stack,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
// import CloudUploadIcon from "@mui/icons-material/CloudUpload";
// import DeleteIcon from "@mui/icons-material/Delete";
// import EditIcon from "@mui/icons-material/Edit";
// import postService from "@/utils/apiCalls/postService";

// // File validation constants
// const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
// const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
// const MAX_DIMENSION = 4096;
// const TARGET_FILE_SIZE = 1 * 1024 * 1024; // 1MB target for compression
// const MAX_IMAGES = 10;

// interface ImageItem {
//   id: string;
//   file: File;
//   preview: string;
//   cropped?: string;
// }

// interface CropImageProps {
//   setIsCaptionPage: (value: boolean) => void;
//   setPostData: (data: any) => void;
// }

// const VisuallyHiddenInput = styled("input")({
//   clip: "rect(0 0 0 0)",
//   clipPath: "inset(50%)",
//   height: 1,
//   overflow: "hidden",
//   position: "absolute",
//   bottom: 0,
//   left: 0,
//   whiteSpace: "nowrap",
//   width: 1,
// });

// const DropZone = styled(Paper)(({ theme }) => ({
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: theme.spacing(4),
//   backgroundColor: theme.palette.grey[50],
//   border: `2px dashed ${theme.palette.grey[300]}`,
//   borderRadius: theme.shape.borderRadius,
//   cursor: "pointer",
//   transition: "all 0.3s ease-in-out",
//   "&:hover": {
//     backgroundColor: theme.palette.grey[100],
//     borderColor: theme.palette.primary.main,
//   },
//   minHeight: 300,
// }));

// const ImagePreview = styled(Paper)(({ theme }) => ({
//   position: "relative",
//   overflow: "hidden",
//   borderRadius: theme.shape.borderRadius,
//   "&:hover .image-actions": {
//     opacity: 1,
//   },
// }));

// function CropImage({ setIsCaptionPage, setPostData }: CropImageProps) {
//   const [images, setImages] = useState<ImageItem[]>([]);
//   const [currentImage, setCurrentImage] = useState<string | null>(null);
//   const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const cropperRef = createRef<any>();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

//   const validateFile = (file: File): string | null => {
//     if (!ALLOWED_TYPES.includes(file.type)) {
//       return "Please upload a valid image file (JPEG, PNG, or WebP)";
//     }
//     if (file.size > MAX_FILE_SIZE) {
//       return "File size exceeds 10MB limit";
//     }
//     return null;
//   };

//   const compressImage = async (file: File): Promise<Blob> => {
//     return new Promise((resolve, reject) => {
//       const img = new Image();
//       img.src = URL.createObjectURL(file);

//       img.onload = () => {
//         URL.revokeObjectURL(img.src);
//         const canvas = document.createElement("canvas");
//         let width = img.width;
//         let height = img.height;

//         if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
//           const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
//           width *= ratio;
//           height *= ratio;
//         }

//         canvas.width = width;
//         canvas.height = height;
//         const ctx = canvas.getContext("2d");
//         if (!ctx) {
//           reject(new Error("Failed to get canvas context"));
//           return;
//         }

//         ctx.drawImage(img, 0, 0, width, height);
//         let quality = 0.9;
//         const compressFile = () => {
//           canvas.toBlob(
//             (blob) => {
//               if (!blob) {
//                 reject(new Error("Failed to compress image"));
//                 return;
//               }
//               if (blob.size <= TARGET_FILE_SIZE || quality <= 0.3) {
//                 resolve(blob);
//               } else {
//                 quality -= 0.1;
//                 compressFile();
//               }
//             },
//             file.type,
//             quality
//           );
//         };

//         compressFile();
//       };

//       img.onerror = () => reject(new Error("Failed to load image"));
//     });
//   };

//   const processFile = async (file: File): Promise<void> => {
//     const error = validateFile(file);
//     if (error) {
//       toast.error(error);
//       return;
//     }

//     if (images.length >= MAX_IMAGES) {
//       toast.error(`Maximum ${MAX_IMAGES} images allowed`);
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const compressedFile = await compressImage(file);
//       const reader = new FileReader();
//       reader.onload = () => {
//         const newImage: ImageItem = {
//           id: Math.random().toString(36).substr(2, 9),
//           file: new File([compressedFile], file.name, { type: file.type }),
//           preview: reader.result as string,
//         };
//         setImages((prev) => [...prev, newImage]);
//         setIsLoading(false);
//       };
//       reader.readAsDataURL(compressedFile);
//     } catch (error) {
//       console.error("Image processing failed:", error);
//       toast.error("Failed to process image. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       for (let i = 0; i < files.length; i++) {
//         if (images.length + i >= MAX_IMAGES) {
//           toast.warning(`Only first ${MAX_IMAGES} images will be uploaded`);
//           break;
//         }
//         await processFile(files[i]);
//       }
//     }
//   };

//   const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     const files = e.dataTransfer.files;
//     for (let i = 0; i < files.length; i++) {
//       if (images.length + i >= MAX_IMAGES) {
//         toast.warning(`Only first ${MAX_IMAGES} images will be uploaded`);
//         break;
//       }
//       await processFile(files[i]);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//   };

//   const handleDeleteImage = (id: string) => {
//     setImages((prev) => prev.filter((img) => img.id !== id));
//   };

//   const handleEditImage = (index: number) => {
//     setCurrentImage(images[index].preview);
//     setCurrentImageIndex(index);
//   };

//   const handleCropComplete = async () => {
//     if (!cropperRef.current?.cropper || currentImageIndex === null) return;

//     const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
//     const croppedBlob = await new Promise<Blob>((resolve) => {
//       croppedCanvas.toBlob((blob: any) => resolve(blob!), "image/jpeg", 0.9);
//     });

//     // Create a new File from the cropped blob
//     const croppedFile = new File([croppedBlob], `cropped-${images[currentImageIndex].file.name}`, {
//       type: 'image/jpeg'
//     });

//     const reader = new FileReader();
//     reader.onload = () => {
//       setImages((prev) => {
//         const newImages = [...prev];
//         newImages[currentImageIndex] = {
//           ...newImages[currentImageIndex],
//           file: croppedFile, // Update the file with cropped version
//           cropped: reader.result as string,
//         };
//         return newImages;
//       });
//     };
//     reader.readAsDataURL(croppedBlob);

//     setCurrentImage(null);
//     setCurrentImageIndex(null);
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (images.length === 0) {
//       toast.error("Please select at least one image");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const formData = new FormData();

//       // Replace forEach with a for...of loop to use async/await
//       for (const image of images) {
//         // Use the cropped file if available, otherwise use original
//         const fileToUpload = image.cropped
//           ? await fetch(image.cropped)
//               .then(r => r.blob())
//               .then(blob => new File([blob], image.file.name, { type: 'image/jpeg' }))
//           : image.file;

//         formData.append(`images`, fileToUpload);
//       }

//       const res = await toast.promise(postService.createPostImage(formData), {
//         pending: "Creating your post...",
//         success: "Ready to add your caption!",
//         error: "Couldn't upload images. Please try again.",
//       });

//       setPostData(res?.data.postData);
//       setIsCaptionPage(true);
//     } catch (error) {
//       console.error("Upload error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       <Box
//         component="form"
//         onSubmit={handleSubmit}
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           gap: 4,
//           py: 4,
//         }}
//       >
//         <ToastContainer />

//         <Typography variant="h4" component="h1" align="center" gutterBottom>
//           Create New Post
//         </Typography>

//         {isLoading ? (
//           <Box
//             display="flex"
//             justifyContent="center"
//             alignItems="center"
//             minHeight={300}
//           >
//             <CircularProgress />
//           </Box>
//         ) : currentImage ? (
//           <Stack spacing={2}>
//             <Paper
//               elevation={2}
//               sx={{
//                 p: 2,
//                 backgroundColor: "white",
//                 borderRadius: 2,
//                 overflow: "hidden",
//               }}
//             >
//               <Cropper
//                 ref={cropperRef}
//                 style={{
//                   height: isMobile ? 300 : 400,
//                   width: "100%",
//                 }}
//                 initialAspectRatio={1}
//                 preview=".img-preview"
//                 src={currentImage}
//                 viewMode={1}
//                 minCropBoxHeight={10}
//                 minCropBoxWidth={10}
//                 background={false}
//                 responsive={true}
//                 autoCropArea={1}
//                 checkOrientation={false}
//                 guides={true}
//                 aspectRatio={1}
//               />
//             </Paper>
//             <Button
//               variant="contained"
//               onClick={handleCropComplete}
//               sx={{ alignSelf: "center" }}
//             >
//               Apply Crop
//             </Button>
//           </Stack>
//         ) : (
//           <>
//             {images.length > 0 && (
//               <ImageList
//                 sx={{ width: "100%", height: "auto" }}
//                 cols={isMobile ? 2 : 3}
//                 gap={8}
//               >
//                 {images.map((image, index) => (
//                   <ImageListItem key={image.id}>
//                     <ImagePreview elevation={2}>
//                       <img
//                         src={image.cropped || image.preview}
//                         alt={`Upload ${index + 1}`}
//                         style={{
//                           width: "100%",
//                           height: "auto",
//                           aspectRatio: "1",
//                           objectFit: "cover",
//                         }}
//                       />
//                       <Box
//                         className="image-actions"
//                         sx={{
//                           position: "absolute",
//                           top: 0,
//                           right: 0,
//                           display: "flex",
//                           gap: 1,
//                           p: 1,
//                           opacity: 0,
//                           transition: "opacity 0.2s",
//                           backgroundColor: "rgba(0, 0, 0, 0.5)",
//                           borderRadius: "0 0 0 8px",
//                         }}
//                       >
//                         <IconButton
//                           size="small"
//                           onClick={() => handleEditImage(index)}
//                           sx={{ color: "white" }}
//                         >
//                           <EditIcon />
//                         </IconButton>
//                         <IconButton
//                           size="small"
//                           onClick={() => handleDeleteImage(image.id)}
//                           sx={{ color: "white" }}
//                         >
//                           <DeleteIcon />
//                         </IconButton>
//                       </Box>
//                     </ImagePreview>
//                   </ImageListItem>
//                 ))}
//               </ImageList>
//             )}

//             {images.length < MAX_IMAGES && (
//               <DropZone onDragOver={handleDragOver} onDrop={handleDrop}>
//                 <IconButton
//                   color="primary"
//                   sx={{ mb: 2, width: 80, height: 80 }}
//                 >
//                   <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
//                 </IconButton>
//                 <Typography variant="h6" color="textSecondary" align="center">
//                   Drag and drop your images here
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary" align="center">
//                   or
//                 </Typography>
//                 <Button
//                   component="label"
//                   variant="contained"
//                   startIcon={<CloudUploadIcon />}
//                   sx={{ mt: 2 }}
//                   disabled={isLoading}
//                 >
//                   Choose Files
//                   <VisuallyHiddenInput
//                     type="file"
//                     onChange={handleImageUpload}
//                     accept={ALLOWED_TYPES.join(",")}
//                     multiple
//                   />
//                 </Button>
//                 <Typography
//                   variant="body2"
//                   color="textSecondary"
//                   align="center"
//                   sx={{ mt: 2 }}
//                 >
//                   Maximum {MAX_IMAGES} images allowed
//                 </Typography>
//               </DropZone>
//             )}
//           </>
//         )}

//         {images.length > 0 && !currentImage && (
//           <Box sx={{ display: "flex", justifyContent: "center" }}>
//             <Button
//               type="submit"
//               variant="contained"
//               size="large"
//               disabled={isLoading}
//               sx={{
//                 px: 4,
//                 py: 1.5,
//                 borderRadius: 2,
//                 textTransform: "none",
//                 fontSize: "1.1rem",
//               }}
//             >
//               {isLoading ? <CircularProgress size={24} /> : "Continue"}
//             </Button>
//           </Box>
//         )}
//       </Box>
//     </Container>
//   );
// }

// export default CropImage;

"use client";
import React, { useState, createRef, ChangeEvent, FormEvent } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
  ImageList,
  ImageListItem,
  Stack,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import postService from "@/utils/apiCalls/postService";

// File validation constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_DIMENSION = 4096;
const TARGET_FILE_SIZE = 1 * 1024 * 1024; // 1MB target for compression
const MAX_IMAGES = 10;

interface ImageItem {
  id: string;
  file: File;
  preview: string;
  cropped?: string;
}

interface CropImageProps {
  setIsCaptionPage: (value: boolean) => void;
  setPostData: (data: any) => void;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const DropZone = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.grey[50],
  border: `2px dashed ${theme.palette.grey[300]}`,
  borderRadius: theme.shape.borderRadius,
  cursor: "pointer",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.grey[100],
    borderColor: theme.palette.primary.main,
  },
  minHeight: 300,
}));

const ImagePreview = styled(Paper)(({ theme }) => ({
  position: "relative",
  overflow: "hidden",
  borderRadius: theme.shape.borderRadius,
  "&:hover .image-actions": {
    opacity: 1,
  },
}));

function CropImage({ setIsCaptionPage, setPostData }: CropImageProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const cropperRef = createRef<any>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Please upload a valid image file (JPEG, PNG, or WebP)";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size exceeds 10MB limit";
    }
    return null;
  };

  const compressImage = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(img.src);
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        let quality = 0.9;
        const compressFile = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }
              if (blob.size <= TARGET_FILE_SIZE || quality <= 0.3) {
                resolve(blob);
              } else {
                quality -= 0.1;
                compressFile();
              }
            },
            file.type,
            quality
          );
        };

        compressFile();
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const autoCropImage = async (imageUrl: string): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Calculate the square crop dimensions
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        // Set canvas to be square
        canvas.width = size;
        canvas.height = size;

        // Draw the cropped image
        ctx.drawImage(
          img,
          startX,
          startY,
          size,
          size, // Source rectangle
          0,
          0,
          size,
          size // Destination rectangle
        );

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to create blob"));
              return;
            }
            resolve(blob);
          },
          "image/jpeg",
          0.9
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    });
  };

  const processFile = async (file: File): Promise<void> => {
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    if (images.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    setIsLoading(true);
    try {
      const compressedFile = await compressImage(file);
      const reader = new FileReader();

      reader.onload = async () => {
        const imageUrl = reader.result as string;

        // Auto crop the image
        const croppedBlob = await autoCropImage(imageUrl);
        const croppedFile = new File([croppedBlob], file.name, {
          type: "image/jpeg",
        });

        // Create preview of the cropped image
        const croppedReader = new FileReader();
        croppedReader.onload = () => {
          const newImage: ImageItem = {
            id: Math.random().toString(36).substr(2, 9),
            file: croppedFile,
            preview: imageUrl,
            cropped: croppedReader.result as string,
          };
          setImages((prev) => [...prev, newImage]);
          setIsLoading(false);
        };
        croppedReader.readAsDataURL(croppedBlob);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error("Image processing failed:", error);
      toast.error("Failed to process image. Please try again.");
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (images.length + i >= MAX_IMAGES) {
          toast.warning(`Only first ${MAX_IMAGES} images will be uploaded`);
          break;
        }
        await processFile(files[i]);
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      if (images.length + i >= MAX_IMAGES) {
        toast.warning(`Only first ${MAX_IMAGES} images will be uploaded`);
        break;
      }
      await processFile(files[i]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDeleteImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleEditImage = (index: number) => {
    setCurrentImage(images[index].preview);
    setCurrentImageIndex(index);
  };

  const handleCropComplete = async () => {
    if (!cropperRef.current?.cropper || currentImageIndex === null) return;

    const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();
    const croppedBlob = await new Promise<Blob>((resolve) => {
      croppedCanvas.toBlob((blob: any) => resolve(blob!), "image/jpeg", 0.9);
    });

    // Create a new File from the cropped blob
    const croppedFile = new File(
      [croppedBlob],
      `cropped-${images[currentImageIndex].file.name}`,
      {
        type: "image/jpeg",
      }
    );

    const reader = new FileReader();
    reader.onload = () => {
      setImages((prev) => {
        const newImages = [...prev];
        newImages[currentImageIndex] = {
          ...newImages[currentImageIndex],
          file: croppedFile, // Update the file with cropped version
          cropped: reader.result as string,
        };
        return newImages;
      });
    };
    reader.readAsDataURL(croppedBlob);

    setCurrentImage(null);
    setCurrentImageIndex(null);
  };

  // ... (keep the rest of the component code unchanged)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();

      for (const image of images) {
        // Always use the cropped version since we now auto-crop on upload
        const fileToUpload = image.cropped
          ? await fetch(image.cropped)
              .then((r) => r.blob())
              .then(
                (blob) =>
                  new File([blob], image.file.name, { type: "image/jpeg" })
              )
          : image.file;

        formData.append(`images`, fileToUpload);
      }

      const res = await toast.promise(postService.createPostImage(formData), {
        pending: "Creating your post...",
        success: "Ready to add your caption!",
        error: "Couldn't upload images. Please try again.",
      });

      setPostData(res?.data.postData);
      setIsCaptionPage(true);
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          py: 4,
        }}
      >

        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Create New Post
        </Typography>

        {isLoading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={300}
          >
            <CircularProgress />
          </Box>
        ) : currentImage ? (
          <Stack spacing={2}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                backgroundColor: "white",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <Cropper
                ref={cropperRef}
                style={{
                  height: isMobile ? 300 : 400,
                  width: "100%",
                }}
                initialAspectRatio={1}
                preview=".img-preview"
                src={currentImage}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                guides={true}
                aspectRatio={1}
              />
            </Paper>
            <Button
              variant="contained"
              onClick={handleCropComplete}
              sx={{ alignSelf: "center" }}
            >
              Apply Crop
            </Button>
          </Stack>
        ) : (
          <>
            {images.length > 0 && (
              <ImageList
                sx={{ width: "100%", height: "auto" }}
                cols={isMobile ? 2 : 3}
                gap={8}
              >
                {images.map((image, index) => (
                  <ImageListItem key={image.id}>
                    <ImagePreview elevation={2}>
                      <img
                        src={image.cropped || image.preview}
                        alt={`Upload ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "auto",
                          aspectRatio: "1",
                          objectFit: "cover",
                        }}
                      />
                      <Box
                        className="image-actions"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          display: "flex",
                          gap: 1,
                          p: 1,
                          opacity: 0,
                          transition: "opacity 0.2s",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          borderRadius: "0 0 0 8px",
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() => handleEditImage(index)}
                          sx={{ color: "white" }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteImage(image.id)}
                          sx={{ color: "white" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </ImagePreview>
                  </ImageListItem>
                ))}
              </ImageList>
            )}

            {images.length < MAX_IMAGES && (
              <DropZone onDragOver={handleDragOver} onDrop={handleDrop}>
                <IconButton
                  color="primary"
                  sx={{ mb: 2, width: 80, height: 80 }}
                >
                  <AddPhotoAlternateIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <Typography variant="h6" color="textSecondary" align="center">
                  Drag and drop your images here
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                >
                  or
                </Typography>
                <Button
                  component="label"
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  sx={{ mt: 2 }}
                  disabled={isLoading}
                >
                  Choose Files
                  <VisuallyHiddenInput
                    type="file"
                    onChange={handleImageUpload}
                    accept={ALLOWED_TYPES.join(",")}
                    multiple
                  />
                </Button>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  align="center"
                  sx={{ mt: 2 }}
                >
                  Maximum {MAX_IMAGES} images allowed
                </Typography>
              </DropZone>
            )}
          </>
        )}

        {images.length > 0 && !currentImage && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
              }}
            >
              {isLoading ? <CircularProgress size={24} /> : "Continue"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default CropImage;
