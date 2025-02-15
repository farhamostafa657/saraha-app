import * as dotenv from "dotenv";
dotenv.config({});

import { createTransport } from "nodemailer";
import { emailTemplate } from "./emailTemplate.js";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.SEND_EMAIL,
    pass: process.env.SEND_EMAIL_PASS,
  },
});

// async..await is not allowed in global scope, must use a wrapper
export default async function seendEmailSaraha(email, url) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Farha Mostafa 👻" <${process.env.SEND_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: emailTemplate(url), // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
