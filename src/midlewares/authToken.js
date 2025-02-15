import jwt from "jsonwebtoken";

export const authToken = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) return res.status(401).json({ message: "no token" });
    const decode = jwt.decode(token, process.env.TOKEN_SECRET_KEY);
    req.userId = decode.id;

    next();
  } catch (error) {
    res.status(500).json({ message: "server error", error });
  }
};
