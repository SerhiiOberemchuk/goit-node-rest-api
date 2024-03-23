import fs from "fs/promises";
import gravatar from "gravatar";

import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { ctrWrapper } from "../helpers/ctrWrapper.js";
import path from "path";
import Jimp from "jimp";

const { JWT_SECRET } = process.env;

const avatarsPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findeUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email);
  console.log(avatarURL);
  const newUser = await authServices.signup({ ...req.body, avatarURL });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findeUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const comparePassword = await authServices.isValidPassword(
    password,
    user.password
  );

  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = { id };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email: user.email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await authServices.updateUser({ _id }, { token: null });
  res.status(204).json({ message: "Logout success" });
};

const updateSubscribe = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { subscription });

  res.json({ message: `Subscription is ${subscription}` });
};

const resizeImage = async (path) => {
  const image = await Jimp.read(path);
  await image.resize(250, 250, Jimp.RESIZE_BICUBIC);
  await image.writeAsync(path);
};

const updateAvatar = async (req, res) => {
  const { path: oldPath, filename } = req.file;

  const pathImage = path.join("tmp", filename);
  await resizeImage(pathImage);

  const newPath = path.join(avatarsPath, filename);
  await fs.rename(oldPath, newPath);

  const avatarURL = path.resolve("avatars", filename);

  const { _id } = req.user;
  await authServices.updateUser({ _id }, { avatarURL });
  res.status(200).json({ message: `"avatarURL": ${avatarURL}` });
};

export default {
  signup: ctrWrapper(signup),
  signin: ctrWrapper(signin),
  getCurrent: ctrWrapper(getCurrent),
  logout: ctrWrapper(logout),
  updateSubscribe: ctrWrapper(updateSubscribe),
  updateAvatar: ctrWrapper(updateAvatar),
};
