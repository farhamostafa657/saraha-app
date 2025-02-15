import userModel from "../../../DB/models/User.model.js";
import * as bcrypt from "bcrypt";
import { uploadToCloudinary } from "../../../utilites/uploadToCloudinary.js";
import CryptoJS from "crypto-js";
import seendEmailSaraha from "../../../utilites/sendEmail.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    //take body from ui
    const { userName, email, password, confirmedPassword, phone } = req.body;

    if (password != confirmedPassword) {
      //validate password and confirmed password
      return res.status(422).json({
        message: "password and confirmed password should be mathed",
      });
    }

    if (!phone) {
      return res.status(422).json({ message: "phone is requeired" });
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

    const cryptoPhone = CryptoJS.AES.encrypt(
      phone,
      process.env.BCRYPT_SECRET_KEY
    ).toString();

    //user here is a document
    const user = await userModel.create({
      userName,
      email,
      password: hashPasswod,
      image: photoUploadResult.secure_url,
      phone: cryptoPhone,
    });

    //transform document user to object
    const userObj = user.toObject();
    delete userObj.password;
    const token = jwt.sign({ email }, process.env.CONFIRM_EMAIL);
    const url = `${req.protocol}://${req.hostname}:8888${req.baseUrl}/verify/${token}`;
    // console.log(url);
    seendEmailSaraha(userObj.email, url);
    res.status(200).json({ message: "welcome to saraha app", userObj });
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

    const userObj = user.toObject();
    delete userObj.password;

    const token = jwt.sign(
      { id: user._id, isLoggedIn: true },
      process.env.TOKEN_SECRET_KEY,
      {
        expiresIn: "3h",
      }
    );

    return res.status(200).json({ message: "welcome to saraha app", token });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const { token } = req.params;
    const decode = jwt.decode(token, process.env.CONFIRM_EMAIL);
    const user = await userModel.findOne({ email: decode.email });
    // console.log(user);
    if (!user) return res.status(200).json({ message: "email not found" });
    // user.confirmEmail=true
    // user.save()
    await userModel.findByIdAndUpdate(
      user._id,
      { confirmEmail: true },
      { new: true }
    );

    res.status(200).json({ message: "updated" });
  } catch (error) {}
};
