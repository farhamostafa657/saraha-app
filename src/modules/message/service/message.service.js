import jwt from "jsonwebtoken";
import userModel from "../../../DB/models/User.model.js";
import messageModel from "../../../DB/models/Message.model.js";

export const createMessage = async (req, res) => {
  try {
    const { message, reciverId } = req.body;

    if (!(await userModel.findById(reciverId))) {
      return res.status(404).json({ message: "reciver donnot exit" });
    }

    const messageCreate = await messageModel.create({
      message,
      reciverId,
    });
    const messageObj = messageCreate.toObject();
    delete messageObj.reciverId;
    res.status(200).json({ message: "message created", messageObj });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const getUserMessage = async (req, res) => {
  try {
    const userID = req.userId;
    console.log(userID);
    const messages = await messageModel.find({ reciverId: userID });
    console.log(messages.length);
    if (messages.length == 0) {
      res.status(400).json({ message: "user donnot have messages" });
    }
    res.status(200).json({ message: "welcome", messages });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

export const deleteMessgae = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(200).json({ message: "no message id" });

    const myMessage = await messageModel.findByIdAndDelete(id);
    console.log(myMessage);
    if (!myMessage)
      return res.status(400).json({ message: "message not found" });

    if (myMessage.reciverId.toString() !== req.userId)
      return res
        .status(400)
        .json({ message: "you donnot have permtion to delete this message" });
    return res
      .status(200)
      .json({ message: "message deleted succesfly", myMessage });
  } catch (error) {
    return res.status(200).json({ message: "server error", error });
  }
};
