import express from "express";
const router = express.Router();

import {
  signIn,
  signUp,
  requestResetPassword,
  verifyResetPasswordToken,
  resetPassword,
  updateProfile,
  updateProfileImage,
  updatePassword,
} from "../controllers/user.js";

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/requestResetPassword", requestResetPassword);
router.post("/verifyResetPasswordToken", verifyResetPasswordToken);
router.patch("/resetPassword", resetPassword);
router.patch("/updateProfile/:userId", updateProfile);
router.patch("/updateProfileImage/:userId", updateProfileImage);
router.patch("/updatePassword/:userId", updatePassword);

export default router;
