import mongoose from "mongoose";

const connection = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("DB connected"))
    .catch(() => console.log("DB connection error"));
};

export default connection;
