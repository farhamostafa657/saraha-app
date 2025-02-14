import { model, Schema } from "mongoose";

const roleType = {
  User: "User",
  Admin: "Admin",
};

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "this field is required"],
      minlength: 2,
      maxlength: 10,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: String,
    gender: {
      type: String,
      enum: ["male", "female"],
      default: "male",
    },
    image: String,
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: Object.values(roleType),
      default: roleType.Admin,
    },
    DOB: Date,
  },
  { timestamps: true } // keys of create at and update at
);

const userModel = model("User", userSchema);

export default userModel;
