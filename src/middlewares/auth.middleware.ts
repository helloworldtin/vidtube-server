import jwt from "jsonwebtoken";
import APIError from "../utils/api_error";
import asyncHandler from "../utils/async_handler";
import { ACCESS_TOKEN_SECRETE } from "../constants";
import User from "../models/user.model";

const verifyJWt = asyncHandler(async (req, res, next) => {
  const accessToken: string | undefined = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (!accessToken) {
    throw new APIError(401, "Unauthorized token");
  }
  const payload = jwt.verify(accessToken, ACCESS_TOKEN_SECRETE);
  console.log(`auth middleware data ${payload}`);
  //@ts-ignore
  const user = await User.findById(payload._id).select("-password -refreshToken");
  if (!user) throw new APIError(401, "Invalid Access Token");
  //@ts-ignore
  req.user = user;
  return next();
});


export default verifyJWt;