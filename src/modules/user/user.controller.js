import { Router } from "express";
import * as userSevice from "./service/user.service.js";
// import uploadByMulter from "../../midlewares/multer.js";

const userRoutes = Router();
userRoutes.put("/", userSevice.updateUser);

export default userRoutes;
