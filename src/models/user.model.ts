import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRETE, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRETE } from "../constants";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: false,
  },
  watchHistory: [
    {
      type: Schema.Types.ObjectId,
      ref: "Video",
    }
  ],
  password: {
    type: String,
    required: [true, "Password is required sir"],
  },
  refreshToken: {
    type: String,
  }
}, {
  timestamps: true,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.isPasswordValid = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function () {
  const payload: {
    _id: Schema.Types.ObjectId,
    email: string,
    username: string,
    fullname: string,
  } = {
    _id: this._id,
    email: this.email,
    username: this.username,
    fullname: this.fullname,
  };
  return jwt.sign(payload, ACCESS_TOKEN_SECRETE, {
    expiresIn: ACCESS_TOKEN_EXPIRY
  })
}

userSchema.methods.generateRefreshToken = function () {
  const payload: {
    _id: Schema.Types.ObjectId,
  } = {
    _id: this._id,

  };
  return jwt.sign(payload, REFRESH_TOKEN_SECRETE, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  })
}
const User = model("User", userSchema);

export default User;