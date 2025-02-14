import userModel from "../../../DB/models/User.model.js";
import * as bcrypt from "bcrypt";
import { uploadToCloudinary } from "../../../utilites/uploadToCloudinary.js";
import CryptoJS from "crypto-js";
import seendEmailSaraha from "../../../utilites/sendEmail.js";

export const register = async (req, res) => {
  try {
    //take body from ui
    const { userName, email, password, confirmedPassword, phone } = req.body;
    //validate password and confirmed password
    if (password != confirmedPassword) {
      return res
        .status(422)
        .json({ message: "password and confirmed password should be mathed" });
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
    seendEmailSaraha(userObj.email);

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
