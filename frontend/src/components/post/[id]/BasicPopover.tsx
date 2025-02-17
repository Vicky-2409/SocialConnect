// "use client";
// import * as React from "react";
// import {
//   Popover,
//   IconButton,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   Fade,
// } from "@mui/material";
// import {
//   MoreVert as MoreVertIcon,
//   Edit as EditIcon,
//   Delete as DeleteIcon,
//   Campaign as CampaignIcon,
//   Report as ReportIcon,
// } from "@mui/icons-material";
// import { useRouter } from "next/navigation";
// import { Bounce, ToastOptions, toast } from "react-toastify";
// import postService from "@/utils/apiCalls/postService";
// import "react-toastify/dist/ReactToastify.css";
// import { IPost, IUser } from "@/types/types";

// type Props = {
//   postData: IPost;
//   currUserData?: IUser;
// };

// const toastOptions: ToastOptions = {
//   position: "top-center",
//   autoClose: 1500,
//   hideProgressBar: false,
//   closeOnClick: true,
//   pauseOnHover: true,
//   draggable: true,
//   progress: undefined,
//   theme: "dark",
//   transition: Bounce,
// };

// export default function PostMenu({ postData, currUserData }: Props) {
//   const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
//   const router = useRouter();

//   const postId = postData._id;
//   const isOwnPost = postData.userId === currUserData?._id;
//   const isProfessionalAccount =
//     currUserData?.accountType.isProfessional || false;

//   const handleClick = (event: React.MouseEvent<HTMLElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const handleDelete = async () => {
//     try {
//       await toast.promise(
//         postService.deletePost(postId),
//         {
//           pending: "Deleting post",
//           success: "Post deleted successfully",
//           error: "Failed to delete post",
//         },
//         toastOptions
//       );
//       router.push("/");
//     } catch (error: any) {
//       console.error(error);
//       const errorMessage = error?.response?.data?.length
//         ? error.response.data
//         : "Internal server error";
//       toast.error(errorMessage, toastOptions);
//     }
//     setDeleteDialogOpen(false);
//     handleClose();
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "post-menu-popover" : undefined;

//   return (
//     <>
//       <IconButton
//         aria-label="more"
//         aria-controls={id}
//         aria-haspopup="true"
//         onClick={handleClick}
//         sx={{
//           mt: 1,
//           "&:hover": {
//             backgroundColor: "rgba(255, 255, 255, 0.1)",
//           },
//         }}
//       >
//         <MoreVertIcon />
//       </IconButton>

//       <Popover
//         id={id}
//         open={open}
//         anchorEl={anchorEl}
//         onClose={handleClose}
//         anchorOrigin={{
//           vertical: "bottom",
//           horizontal: "right",
//         }}
//         transformOrigin={{
//           vertical: "top",
//           horizontal: "right",
//         }}
//         TransitionComponent={Fade}
//         PaperProps={{
//           sx: {
//             width: 200,
//             backgroundColor: "background.paper",
//             borderRadius: 2,
//             boxShadow: 3,
//           },
//         }}
//       >
//         <List sx={{ p: 1 }}>
//           {isOwnPost ? (
//             <>
//               <ListItem
//                 component="button" // Ensure ListItem acts as a button
//                 onClick={() => {
//                   router.push(`/post/edit/${postId}`);
//                   handleClose();
//                 }}
//                 sx={{
//                   borderRadius: 1,
//                   "&:hover": {
//                     backgroundColor: "action.hover",
//                   },
//                 }}
//               >
//                 <ListItemIcon>
//                   <EditIcon fontSize="small" />
//                 </ListItemIcon>
//                 <ListItemText primary="Edit" />
//               </ListItem>

//               <ListItem
//                 component="button"
//                 onClick={() => setDeleteDialogOpen(true)}
//                 sx={{
//                   borderRadius: 1,
//                   "&:hover": {
//                     backgroundColor: "action.hover",
//                   },
//                 }}
//               >
//                 <ListItemIcon>
//                   <DeleteIcon fontSize="small" color="error" />
//                 </ListItemIcon>
//                 <ListItemText primary="Delete" sx={{ color: "error.main" }} />
//               </ListItem>

//               {isProfessionalAccount && (
//                 <ListItem
//                   component="button"
//                   onClick={() => {
//                     router.push(`/post/promote/${postId}`);
//                     handleClose();
//                   }}
//                   sx={{
//                     borderRadius: 1,
//                     "&:hover": {
//                       backgroundColor: "action.hover",
//                     },
//                   }}
//                 >
//                   <ListItemIcon>
//                     <CampaignIcon fontSize="small" />
//                   </ListItemIcon>
//                   <ListItemText primary="Promote Post" />
//                 </ListItem>
//               )}
//             </>
//           ) : (
//             <ListItem
//               component="button"
//               onClick={() => {
//                 router.push(`/post/report/${postId}`);
//                 handleClose();
//               }}
//               sx={{
//                 borderRadius: 1,
//                 "&:hover": {
//                   backgroundColor: "action.hover",
//                 },
//               }}
//             >
//               <ListItemIcon>
//                 <ReportIcon fontSize="small" />
//               </ListItemIcon>
//               <ListItemText primary="Report" />
//             </ListItem>
//           )}
//         </List>
//       </Popover>

//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         PaperProps={{
//           sx: {
//             width: "100%",
//             maxWidth: 400,
//             borderRadius: 2,
//           },
//         }}
//       >
//         <DialogTitle>Delete Post?</DialogTitle>
//         <DialogContent>
//           Do you really want to delete this post? This action cannot be undone.
//         </DialogContent>
//         <DialogActions sx={{ p: 2, pt: 0 }}>
//           <Button
//             onClick={() => setDeleteDialogOpen(false)}
//             sx={{ color: "text.secondary" }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={handleDelete}
//             variant="contained"
//             color="error"
//             sx={{
//               minWidth: 100,
//               "&:hover": {
//                 backgroundColor: "error.dark",
//               },
//             }}
//           >
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }




















































"use client";
import * as React from "react";
import {
  Popover,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Fade,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Campaign as CampaignIcon,
  Report as ReportIcon,
  Share as ShareIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { Bounce, ToastOptions, toast } from "react-toastify";
import postService from "@/utils/apiCalls/postService";
import "react-toastify/dist/ReactToastify.css";
import { IPost, IUser } from "@/types/types";

type Props = {
  postData: IPost;
  currUserData?: IUser;
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

export default function PostMenu({ postData, currUserData }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const router = useRouter();

  const postId = postData._id;
  const isOwnPost = postData.userId === currUserData?._id;
  const isProfessionalAccount =
    currUserData?.accountType.isProfessional || false;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/post/${postId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Share Post',
          url: shareUrl
        });
        toast.success('Shared successfully', toastOptions);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard', toastOptions);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share post', toastOptions);
    }
    handleClose();
  };

  const handleDelete = async () => {
    try {
      await toast.promise(
        postService.deletePost(postId),
        {
          pending: "Deleting post",
          success: "Post deleted successfully",
          error: "Failed to delete post",
        },
        toastOptions
      );
      router.push("/");
    } catch (error: any) {
      console.error(error);
      const errorMessage = error?.response?.data?.length
        ? error.response.data
        : "Internal server error";
      toast.error(errorMessage, toastOptions);
    }
    setDeleteDialogOpen(false);
    handleClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? "post-menu-popover" : undefined;

  return (
    <>
      <IconButton
        aria-label="more"
        aria-controls={id}
        aria-haspopup="true"
        onClick={handleClick}
        sx={{
          mt: 1,
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <MoreVertIcon />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        TransitionComponent={Fade}
        PaperProps={{
          sx: {
            width: 200,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
          },
        }}
      >
        <List sx={{ p: 1 }}>
          {/* Share option - available to all users */}
          <ListItem
            component="button"
            onClick={handleShare}
            sx={{
              borderRadius: 1,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Share" />
          </ListItem>

          {isOwnPost ? (
            <>
              <ListItem
                component="button"
                onClick={() => {
                  router.push(`/post/edit/${postId}`);
                  handleClose();
                }}
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon>
                  <EditIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Edit" />
              </ListItem>

              <ListItem
                component="button"
                onClick={() => setDeleteDialogOpen(true)}
                sx={{
                  borderRadius: 1,
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <ListItemIcon>
                  <DeleteIcon fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText primary="Delete" sx={{ color: "error.main" }} />
              </ListItem>

              {isProfessionalAccount && (
                <ListItem
                  component="button"
                  onClick={() => {
                    router.push(`/post/promote/${postId}`);
                    handleClose();
                  }}
                  sx={{
                    borderRadius: 1,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon>
                    <CampaignIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary="Promote Post" />
                </ListItem>
              )}
            </>
          ) : (
            <ListItem
              component="button"
              onClick={() => {
                router.push(`/post/report/${postId}`);
                handleClose();
              }}
              sx={{
                borderRadius: 1,
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              <ListItemIcon>
                <ReportIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Report" />
            </ListItem>
          )}
        </List>
      </Popover>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 400,
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle>Delete Post?</DialogTitle>
        <DialogContent>
          Do you really want to delete this post? This action cannot be undone.
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "text.secondary" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{
              minWidth: 100,
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}