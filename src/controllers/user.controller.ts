import User from '../models/user.model';
import APIError from '../utils/api_error';
import APIResponse from '../utils/api_response';
import asyncHandler from '../utils/async_handler';
import uploadFileOnCloudinary from '../utils/cloudinary';

interface IInputUser {
  username: string;
  email: string;
  avatar: string;
  coverImage?: string;
  fullname: string;
  password: string;
}

const registerUser = asyncHandler(async (req, res, next) => {
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

export { registerUser };