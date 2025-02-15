import { Router } from "express";
import * as messageService from "./service/message.service.js";
import { validation } from "../../midlewares/validation.js";
import { createMessageValidation } from "./service/message.validation.js";
import { authToken } from "../../midlewares/authToken.js";

const messageRoutes = Router();

messageRoutes.post(
  "/createMessage",
  validation(createMessageValidation),
  messageService.createMessage
);

messageRoutes.get("/getMessage", authToken, messageService.getUserMessage);
messageRoutes.delete(
  "/deleteMessage/:id",
  authToken,
  messageService.deleteMessgae
);

export default messageRoutes;
