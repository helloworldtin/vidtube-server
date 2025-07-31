import asyncHandler from '../utils/async_handler';

const registerUser = asyncHandler(async (req, res, next) => {
  return res.status(200).json({
    message: "server is working perfect",
  })
});

export { registerUser };