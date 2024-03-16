import * as authServices from "../services/authServices.js";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { ctrWrapper } from "../helpers/ctrWrapper.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findeUser({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await authServices.signup(req.body);
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

export default {
  signup: ctrWrapper(signup),
  signin: ctrWrapper(signin),
  getCurrent: ctrWrapper(getCurrent),
  logout: ctrWrapper(logout),
  updateSubscribe: ctrWrapper(updateSubscribe),
};
