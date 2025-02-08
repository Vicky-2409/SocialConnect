import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { userController, profileController } from "./injection";
import { verifyUser } from "../middlewares/verifyUser";
import upload from "../utils/multer";

const router = Router();

// User routes
const userRoutes = Router();
userRoutes.post(
  "/signup",
  userController.signupController.bind(userController)
);
userRoutes.post(
  "/signup/sendOTP",
  userController.sendOTPController.bind(userController)
);
userRoutes.post(
  "/signup/reSendOTP",
  userController.reSendOTPController.bind(userController)
);
userRoutes.post(
  "/signup/verifyOTP",
  userController.verifyOTPController.bind(userController)
);
userRoutes.post("/login", userController.loginController.bind(userController));
userRoutes.post(
  "/login/googleSignin",
  userController.googleSigninController.bind(userController)
);

//forgot and change password
userRoutes.post(
  "/forgotPassword",
  userController.forgotPassword.bind(userController)
);
userRoutes.patch(
  "/changePassword",
  verifyUser,
  userController.changePassword.bind(userController)
);

//account type
userRoutes.patch(
  "/changeAccountType",
  verifyUser,
  userController.changeAccountType.bind(userController)
);

//WeNet-tick routes
userRoutes.post(
  "/requestWenetTick",
  verifyUser,
  upload.single("image"),
  profileController.uploadWeNetTickRequestPic.bind(profileController),
  userController.requestWenetTick.bind(userController)
);
userRoutes.get(
  "/hasRequestedTick",
  verifyUser,
  userController.hasRequestedTick.bind(userController)
);
userRoutes.get(
  "/hasWenetTick/:username",
  userController.hasWenetTick.bind(userController)
);

// Profile routes
const profileRoutes = Router();
profileRoutes.get(
  "/userData/:id",
  verifyUser,
  profileController.getUserData.bind(profileController)
);
profileRoutes.get(
  "/userData",
  verifyUser,
  profileController.getUser.bind(profileController)
);
profileRoutes.put(
  "/userData",
  verifyUser,
  profileController.editUser.bind(profileController)
);
profileRoutes.patch(
  "/userData/image/:imageType",
  verifyUser,
  upload.single("image"),
  profileController.updatePic.bind(profileController),
  profileController.editUser.bind(profileController)
);
profileRoutes.get(
  "/search",
  verifyUser,
  profileController.searchUsers.bind(profileController)
);

profileRoutes.get(
  "/isFollowing/:userId",
  verifyUser,
  profileController.isFollowing.bind(profileController)
);
profileRoutes.patch(
  "/toggleFollow/:userToFollow",
  verifyUser,
  profileController.toggleFollow.bind(profileController)
);
profileRoutes.delete(
  "/toggleRemove/:userToRemove",
  verifyUser,
  profileController.toggleRemove.bind(profileController)
);

profileRoutes.get(
  "/isBlocked/:userId",
  verifyUser,
  profileController.isBlocked.bind(profileController)
);
profileRoutes.patch(
  "/toggleBlock/:userId",
  verifyUser,
  profileController.toggleBlockUser.bind(profileController)
);
profileRoutes.get(
  "/getBlockedUsers",
  verifyUser,
  profileController.getBlockedUsers.bind(profileController)
),
  profileRoutes.get(
    "/getFollowing",
    verifyUser,
    profileController.getFollowingUsers.bind(profileController)
  );

profileRoutes.get(
  "/:username",
  profileController.getProfileData.bind(profileController)
);
// Routes
router.use("/", userRoutes);
router.use("/profile", profileRoutes);

export default router;
