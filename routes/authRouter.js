import express from "express";

import authController from "../controllers/authControllers.js";

import validateBody from "../helpers/validateBody.js";

import {
  userSignUpSchema,
  userLoginSchema,
  userUpdateSubscribe,
} from "../schemas/usersSchemas.js";

import authenticate from "../middlewares/authenticate.js";
// import { upload } from "../middlewares/upload .js";

import multer from "multer";
import path from "path";

const tempDir = path.resolve("../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename(reg, file, cb) {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: multerConfig,
});

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(userSignUpSchema),
  upload.single(),
  authController.signup
);

authRouter.post("/login", validateBody(userLoginSchema), authController.signin);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(userUpdateSubscribe),
  authController.updateSubscribe
);

export default authRouter;
