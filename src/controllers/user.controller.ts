import { cookieOption, REFRESH_TOKEN_SECRETE } from '../constants';
import User from '../models/user.model';
import APIError from '../utils/api_error';
import APIResponse from '../utils/api_response';
import asyncHandler from '../utils/async_handler';
import uploadFileOnCloudinary from '../utils/cloudinary';
import jwt from 'jsonwebtoken'

const registerUser = asyncHandler(async (req, res, next) => {
  interface IInputUser {
    username: string;
    email: string;
    avatar: string;
    coverImage?: string;
    fullname: string;
    password: string;
  }
  // get users detail from frontend
  const { username, email, avatar, coverImage, fullname, password }: IInputUser = req.body;

  // validation
  if ([username, email, avatar, coverImage, fullname, password].some((field) => (field?.trim() === ""))) {
    throw new APIError(400, "please check you fields");
  }
  // check if use already exist
  // check with email or username
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) throw new APIError(409, "User with this email or username already exist");
  // check for images, check for avatar

  //@ts-ignore
  const avatarLocalFilePath = req.files?.avatar[0]?.path;
  //@ts-ignore
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalFilePath) {
    throw new APIError(400, "Avatar image required");
  }
  // upload them to cloudinary
  const avatarCloudinary = await uploadFileOnCloudinary(avatarLocalFilePath);
  let coverImageCloudinary;
  if (coverImageLocalPath) {
    coverImageCloudinary = await uploadFileOnCloudinary(coverImageLocalPath);
  }
  if (avatarCloudinary === null) throw new APIError(500, "Unable to upload avatar");

  // create user object - create entry in db.
  const user = await User.create({
    fullname,
    avatar: avatarCloudinary?.secure_url,
    coverImage: coverImageCloudinary?.secure_url || null,
    email,
    password,
    username,
  });
  // remove password and refresh token field from response.
  // check for user creation
  const dbUser = await User.findById(user._id).select("-password -refreshToken");

  if (!dbUser) throw new APIError(500, "Something went while registering the user");

  // return res
  return res.status(201).json(
    new APIResponse(201, dbUser, "User created successfully"),
  );
});

const loginUser = asyncHandler(async (req, res, next) => {
  interface LoginI {
    email?: string;
    username?: string;
    password: string;
  }
  // get the email and password
  const { email, username, password }: LoginI = req.body;

  if (!(username || email)) {
    throw new APIError(400, "username or password is required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  // check present in db
  if (!user) {
    throw new APIError(404, "user not found");
  }
  // verify the password
  const valid = await user.isPasswordValid(password);

  if (!valid) throw new APIError(401, "password incorrect");
  // generate tokens
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  if (!accessToken && !refreshToken) {
    throw new APIError(500, "Something went wrong while generate refresh and access token")
  }
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false })

  return res.status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .json(new APIResponse(200, { accessToken, refreshToken }, "user logged in successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const refreshTokenClient: string | undefined = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshTokenClient) {
    throw new APIError(401, "unauthorized request");
  }
  const decodedToken = jwt.verify(refreshTokenClient, REFRESH_TOKEN_SECRETE);
  if (!decodedToken) throw new APIError(401, "unauthorized request");
  // @ts-ignore
  const user = await User.findById(decodedToken._id);
  if (!user) throw new APIError(401, "unauthorized request");

  if (refreshTokenClient !== user.refreshToken) throw new APIError(401, "Refresh token is expired or used");
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  if (!accessToken && !refreshToken) {
    throw new APIError(500, "Something went wrong while generate refresh and access token")
  }
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return res.status(200)
    .cookie("accessToken", accessToken, cookieOption)
    .cookie("refreshToken", refreshToken, cookieOption)
    .json(new APIResponse(200, { accessToken, refreshToken }, "refresh token refreshed successfully"));
});

const logout = asyncHandler(async (req, res, next) => {
  //@ts-ignore
  const user = req.user;
  await User.findByIdAndUpdate(user._id, {
    $set: {
      refreshToken: undefined,
    },

  }, {
    new: true,
  });
  return res.status(200).clearCookie("accessToken", cookieOption).clearCookie("refreshToken", cookieOption).json(new APIResponse(200, {}, "User logged out successfully"));
});

export { registerUser, loginUser, refreshAccessToken, logout };