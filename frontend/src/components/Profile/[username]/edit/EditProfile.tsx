"use client";
import { saveUser } from "@/redux/userSlice";
import { IUser } from "@/types/types";
import userService from "@/utils/apiCalls/userService";
import { USER_SERVICE_URL } from "@/utils/constants";
import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import { PhotoCamera, ArrowBack } from "@mui/icons-material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Bounce, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateDateOfBirth,
  validateDateOfBirthEdit,
} from "@/utils/validateDOB";

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 20,
  overflow: "hidden",
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
}));

const CoverPhotoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  height: 240,
  width: "100%",
  backgroundColor: theme.palette.grey[200],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  position: "relative",
  marginTop: -50,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(2),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 120,
  height: 120,
  border: `4px solid ${theme.palette.background.paper}`,
  boxShadow: theme.shadows[3],
}));

const PhotoButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
}));

// Types
type Inputs = {
  _id?: string;
  firstName: string;
  lastName: string;
  bio: string;
  location: string;
  dateOfBirth: string;
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

function EditProfile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userService.getCurrUserData();
        setUserData(userData);
        dispatch(saveUser({ userData }));
      } catch (err: any) {
        setError(err.response?.data || "Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch]);

  if (loading) {
    return <Typography color="textPrimary">Loading...</Typography>;
  }

  if (error) {
    toast(error, toastOptions);
    return <Typography color="error">{error}</Typography>;
  }

  const {
    firstName,
    lastName,
    username,
    bio = "",
    profilePicUrl = "/img/DefaultProfilePicMale.png",
    coverPicUrl = "",
  } = userData || {};

  const dateOfBirth = userData?.dateOfBirth
    ? new Date(userData.dateOfBirth + "").toISOString().split("T")[0]
    : null;

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      data._id = userData?._id;
      await toast.promise(
        userService.editProfile(data),
        {
          pending: "Saving changes",
          success: "Profile edited successfully",
          error: "Failed to edit profile",
        },
        toastOptions
      );
      router.replace(`/profile/${userData?.username}`);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to edit profile";
      toast.error(errorMessage, toastOptions);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => router.back()}
        sx={{ mb: 2 }}
      >
        Back
      </Button>

      <StyledPaper>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CoverPhotoContainer>
            {coverPicUrl ? (
              <Image
                src={coverPicUrl}
                alt="Cover"
                layout="fill"
                objectFit="cover"
                unoptimized
              />
            ) : (
              <Typography color="textSecondary">No Cover Photo</Typography>
            )}
            <PhotoButton
              sx={{ top: 16, right: 16 }}
              onClick={() =>
                router.push(`/profile/${username}/edit/coverimage`)
              }
            >
              <PhotoCamera />
            </PhotoButton>
          </CoverPhotoContainer>

          <ProfileSection>
            <Box sx={{ position: "relative" }}>
              <StyledAvatar src={profilePicUrl} alt={firstName} />
              <PhotoButton
                size="small"
                sx={{ bottom: 0, right: 0 }}
                onClick={() => router.push(`/profile/${username}/edit/image`)}
              >
                <PhotoCamera />
              </PhotoButton>
            </Box>
            <Typography variant="h5" sx={{ mt: 2, fontWeight: 600 }}>
              {`${firstName} ${lastName}`}
            </Typography>
            <Typography color="textSecondary">@{username}</Typography>
          </ProfileSection>

          <FormContainer>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  defaultValue={firstName}
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  defaultValue={lastName}
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  defaultValue={bio}
                  {...register("bio")}
                  multiline
                  rows={3}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  defaultValue={userData?.location || ""}
                  {...register("location", {
                    required: "Location is required",
                  })}
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  defaultValue={dateOfBirth || ""}
                  {...register("dateOfBirth", {
                    required: "Date of Birth is required",
                    validate: validateDateOfBirthEdit,
                  })}
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 8,
                  textTransform: "none",
                  fontSize: "1.1rem",
                }}
              >
                Save Changes
              </Button>
            </Box>
          </FormContainer>
        </form>
      </StyledPaper>
    </Container>
  );
}

export default EditProfile;
