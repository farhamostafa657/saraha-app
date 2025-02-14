import { Router } from "express";
import * as authService from "./service/auth.service.js";
import uploadByMulter from "../../midlewares/multer.js";

const authRoutes = Router();
authRoutes.post(
  "/signUp",
  uploadByMulter.fields([{ name: "photo", maxCount: 1 }]),
  authService.register
);
authRoutes.post("/login", authService.login);

export default authRoutes;
