import { Router } from "express";
import { loginUser, logout, refreshAccessToken, registerUser } from "../controllers/user.controller";
import upload from "../middlewares/multer.middleware";
import verifyJWt from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post("/register", upload.fields([{
  name: "avatar",
  maxCount: 1,
}, {
  name: "coverImage",
  maxCount: 1,
}]), registerUser);

userRouter.post("/login", loginUser);
userRouter.post("/refresh-access-token", refreshAccessToken);

// secured routes
userRouter.post("/logout", verifyJWt, logout);

export default userRouter;;