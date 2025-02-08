"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  CircularProgress,
  Fade,
  Paper,
} from "@mui/material";
import {
  AddCircleOutline as AddIcon,
  Feed as FeedIcon,
} from "@mui/icons-material";
import FeedPost from "../feed/FeedPost";
import postService from "@/utils/apiCalls/postService";
import { IPost, IUser } from "@/types/types";
import { useParams } from "next/navigation";

function ProfileFeed({ currUserData }: { currUserData: IUser }) {
  const [postData, setPostData] = useState<IPost[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams<{ username: string }>();
  const paramsUsername = params.username;
  const isOwnProfile = currUserData.username === paramsUsername;

  useEffect(() => {
    async function fetchProfileFeed(username: string) {
      setIsLoading(true);
      setError(null);
      try {
        const posts = await postService.getProfileFeed(username);
        setPostData(posts);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileFeed(paramsUsername);
  }, [paramsUsername]);

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          href="/"
          startIcon={<FeedIcon />}
          sx={{ mt: 2 }}
        >
          Return to Feed
        </Button>
      </Paper>
    );
  }

  if (!postData?.length) {
    return (
      <Fade in>
        <Paper
          elevation={0}
          sx={{
            p: 4,
            minHeight: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h6"
            color="text.secondary"
            gutterBottom
            sx={{ fontWeight: 500 }}
          >
            No posts made yet!
          </Typography>

          <Button
            variant="contained"
            startIcon={isOwnProfile ? <AddIcon /> : <FeedIcon />}
            href={isOwnProfile ? "/createPost" : "/"}
            sx={{
              mt: 2,
              px: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 500,
              "&:hover": {
                transform: "translateY(-1px)",
                transition: "transform 0.2s",
              },
            }}
          >
            {isOwnProfile ? "Create a post" : "Go to feed"}
          </Button>
        </Paper>
      </Fade>
    );
  }

  return (
    <Fade in>
      <Container
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {postData.map((post) => (
          <Paper
            key={post._id}
            elevation={0}
            sx={{
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 1,
              },
            }}
          >
            <FeedPost postData={post} currUserData={currUserData} />
          </Paper>
        ))}
      </Container>
    </Fade>
  );
}

export default ProfileFeed;
