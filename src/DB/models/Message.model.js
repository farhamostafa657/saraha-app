import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, "this field is required"],
    },
    reciverId: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true } // keys of create at and update at
);

const messageModel = model("Message", messageSchema);

export default messageModel;

//validatin
//message crud
//upload image
