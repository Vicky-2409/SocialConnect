import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { IconButton } from "@mui/material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import SendIcon from "@mui/icons-material/Send";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import postService from "@/utils/apiCalls/postService";

interface Props {
  postData: {
    _id: string;
    imageUrls: string[];
  };
}

type Inputs = {
  _id: string;
  caption: string;
};

// Custom styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}));

const ImageContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "auto",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
}));

const CarouselContainer = styled(Box)({
  position: "relative",
  width: "100%",
  aspectRatio: "1/1",
});

const NavigationButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  zIndex: 2,
}));

const NavigationDots = styled(Box)({
  position: "absolute",
  bottom: "16px",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: "8px",
  zIndex: 2,
});

const Dot = styled(Box)<{ active?: boolean }>(({ active, theme }) => ({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: active
    ? theme.palette.primary.main
    : "rgba(255, 255, 255, 0.6)",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  dataActive: active ? "true" : "false", // Ensuring it's a string
}));

function AddCaption({ postData }: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<Inputs>();

  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const caption = watch("caption", "");

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? postData.imageUrls.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === postData.imageUrls.length - 1 ? 0 : prev + 1
    );
  };

  const onEmojiClick = (emojiObject: any) => {
    const caption = watch("caption") || "";
    setValue("caption", caption + emojiObject.emoji);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      data._id = postData._id;
      const res = await toast.promise(
        postService.createPost(data),
        {
          pending: "Creating your masterpiece...",
          success: "Post shared successfully! 🎉",
          error: "Oops! Something went wrong.",
        },
        {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        }
      );
      router.push(`/post/${res.data._id}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.length
        ? error.response.data
        : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 4, md: 8 },
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <StyledPaper>
        <Box
          sx={{
            p: 3,
            background: theme.palette.primary.main,
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" component="h1" fontWeight="bold">
            Add Your Caption
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 4 } }}>
          <ImageContainer>
            <CarouselContainer>
              {postData.imageUrls.length > 1 && (
                <>
                  <NavigationButton onClick={handlePrevImage} sx={{ left: 16 }}>
                    <ChevronLeftIcon />
                  </NavigationButton>
                  <NavigationButton
                    onClick={handleNextImage}
                    sx={{ right: 16 }}
                  >
                    <ChevronRightIcon />
                  </NavigationButton>
                </>
              )}

              <Image
                src={postData.imageUrls[currentImageIndex]}
                fill
                alt={`Post preview ${currentImageIndex + 1}`}
                style={{ objectFit: "cover" }}
                priority
                unoptimized
              />

              {postData.imageUrls.length > 1 && (
                <NavigationDots>
                  {postData.imageUrls.map((_, index) => (
                    <Dot
                      key={index}
                      active={index === currentImageIndex}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </NavigationDots>
              )}
            </CarouselContainer>
          </ImageContainer>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              mt: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box sx={{ position: "relative" }}>
              <TextField
                {...register("caption", {
                  maxLength: {
                    value: 140,
                    message: "Caption should be less than 140 characters",
                  },
                })}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
                placeholder="Write a caption for your post..."
                error={!!errors.caption}
                helperText={
                  errors.caption?.message || `${caption.length}/140 characters`
                }
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      sx={{ position: "absolute", bottom: 8, right: 8 }}
                    >
                      <EmojiEmotionsIcon />
                    </IconButton>
                  ),
                }}
              />
              {showEmojiPicker && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: "100%",
                    right: 0,
                    zIndex: 1,
                    boxShadow: 3,
                    marginBottom: 1,
                  }}
                >
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    width={isMobile ? 300 : 350}
                    height={400}
                  />
                </Box>
              )}
            </Box>

            {isSubmitting && <LinearProgress sx={{ my: 1 }} />}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              endIcon={<SendIcon />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1.1rem",
                alignSelf: "center",
                minWidth: isMobile ? "100%" : "200px",
              }}
            >
              Share Post
            </Button>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
}

export default AddCaption;
