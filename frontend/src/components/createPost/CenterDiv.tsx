"use client";

import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Alert,
  AlertTitle,
  Container,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import CropImage from "./CropImage";
import AddCaption from "./AddCaption";

type CenterDivProps = {
  isRestricted: boolean;
};

const RestrictedMessage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: 400,
            textAlign: "center",
            borderRadius: 2,

            color: theme.palette.error.dark,
          }}
        >
          <ErrorIcon
            sx={{
              fontSize: 48,
              mb: 2,
              color: theme.palette.error.dark,
            }}
          />
          <Typography
            variant={isMobile ? "h6" : "h5"}
            component="h2"
            gutterBottom
            fontWeight="bold"
          >
            Access Restricted
          </Typography>
          <Alert
            severity="error"
            variant="outlined"
            sx={{
              mt: 2,
              backgroundColor: "transparent",
              "& .MuiAlert-message": {
                width: "100%",
              },
            }}
          >
            <AlertTitle>Unable to Create Post</AlertTitle>
            You are currently restricted from posting. Please contact support or
            try again later.
          </Alert>
        </Paper>
      </Box>
    </Container>
  );
};

const CenterDiv = ({ isRestricted }: CenterDivProps) => {
  const [isCaptionPage, setIsCaptionPage] = useState(false);
  const [postData, setPostData] = useState(null);

  if (isRestricted) {
    return <RestrictedMessage />;
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      {isCaptionPage && postData ? (
        <AddCaption postData={postData} />
      ) : (
        <CropImage
          setIsCaptionPage={setIsCaptionPage}
          setPostData={setPostData}
        />
      )}
    </Box>
  );
};

export default CenterDiv;
