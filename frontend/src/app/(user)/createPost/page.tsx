"use client";

import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import CenterDiv from "@/components/createPost/CenterDiv";
import userService from "@/utils/apiCalls/userService";

const ErrorFallback = ({ error }: { error: Error }) => (
  <Container maxWidth="sm">
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 2,
      }}
    >
      <Alert
        severity="error"
        sx={{
          width: "100%",
          "& .MuiAlert-message": {
            width: "100%",
          },
        }}
      >
        <Typography variant="h6" gutterBottom>
          Unable to Load Create Post
        </Typography>
        <Typography variant="body2">
          {error.message || "Error getting current user's data"}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Please try refreshing the page or contact support if the issue
          persists.
        </Typography>
      </Alert>
    </Box>
  </Container>
);

const LoadingSpinner = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <CircularProgress />
  </Box>
);

const CreatePostPage = () => {
  const [isRestrictedUntil, setIsRestrictedUntil] = useState<Date | null>(null);
  const [isRestricted, setIsRestricted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const decoded = await userService.getCurrUserData();

        if (decoded.restrictedFromPostingUntil) {
          const restrictionDate = new Date(decoded.restrictedFromPostingUntil);
          setIsRestrictedUntil(restrictionDate);
          setIsRestricted(restrictionDate > new Date());
        }

        setLoading(false);
      } catch (err) {
        console.error("Error checking isVerified in post", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {isRestricted && isRestrictedUntil && (
        <Alert severity="warning" sx={{ mb: 2, mt: 2 }}>
          <Typography variant="body1">
            Your posting privileges are currently restricted until{" "}
            {isRestrictedUntil.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Alert>
      )}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <CenterDiv isRestricted={isRestricted} />
      </Box>
    </Container>
  );
};

export default CreatePostPage;
