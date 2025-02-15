import { Router } from "express";
import * as authService from "./service/auth.service.js";
import uploadByMulter from "../../midlewares/multer.js";
import { validation } from "../../utilites/validation.js";
import {
  signInValidationSchema,
  signUpValidationSchema,
} from "./service/auth.validation.js";

const authRoutes = Router();
authRoutes.post(
  "/signUp",
  validation(signUpValidationSchema),
  uploadByMulter.fields([{ name: "photo", maxCount: 1 }]),
  authService.register
);
authRoutes.post(
  "/login",
  validation(signInValidationSchema),
  authService.login
);
authRoutes.get("/verify/:token", authService.verify);

export default authRoutes;
