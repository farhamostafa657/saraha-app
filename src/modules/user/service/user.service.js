import jwt from "jsonwebtoken";
import userModel from "../../../DB/models/User.model.js";

export const updateUser = async (req, res) => {
  try {
    const { token } = req.headers;
    console.log(token);
    const decode = jwt.decode(token, process.env.TOKEN_SECRET_KEY);
    console.log(decode);

    const updatedUser = await userModel.findByIdAndUpdate(
      decode.id,
      {
        userName: req.body.userName,
      },
      { new: true }
    );

    res.status(200).json({ message: "welcome", updatedUser });
  } catch (error) {}
};
