import userModel from "../../../DB/models/User.model.js";
import * as bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import { uploadToCloudinary } from "../../../utilites/uploadToCloudinary.js";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "maddison53@ethereal.email",
    pass: "jn7jnAPss4f63QBp6D",
  },
});

async function sendEmail(toUser, sub, txt) {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: toUser, // list of receivers
    subject: sub, // Subject line
    text: txt,
    html: "<p>halloooo from saraha app</p>", // plain text body
  });
  console.log("Message sent: %s", info.messageId);
}

export const register = async (req, res) => {
  try {
    //take body from ui
    const { userName, email, password, confirmedPassword } = req.body;
    //validate password and confirmed password
    if (password != confirmedPassword) {
      return res
        .status(422)
        .json({ message: "password and confirmed password should be mathed" });
    }
    //check if the email exist in the database
    if (await userModel.findOne({ email })) {
      // 409 conflict
      return res.status(409).json({ message: "email already exist" });
    }

    if (!req.files || !req.files.photo || req.files.photo.length === 0) {
      return res.status(400).json({ message: "Photo is required!" });
    }

    const photoBuffer = req.files.photo[0].buffer;

    const photoUploadResult = await uploadToCloudinary(
      photoBuffer,
      "users-photos"
    );
    // hashing password using bcrypt

    const hashPasswod = bcrypt.hashSync(
      password,
      parseInt(process.env.SALT_ROUNDED)
    );

    //user here is a document
    const user = await userModel.create({
      userName,
      email,
      password: hashPasswod,
      image: photoUploadResult.secure_url,
    });

    sendEmail(email, "app message", "hello from saraha app");

    //transform document user to object
    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json({ message: "welcome to register", userObj });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "email not exist" });
    }

    //shoud send to compare sync origiak data and incrypted data
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "invalid password" });
    }
    sendEmail(email, "saraha app", "hello from saraha app");
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(200).json({ message: "welcome to saraha app", userObj });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};
