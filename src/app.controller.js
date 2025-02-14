import connection from "./DB/connection.js";
import authRoutes from "./modules/auth/auth.controller.js";

const bootStrap = (app, express) => {
  app.use(express.json()); //middle ware convert all buffering data to json

  app.get("/", (req, res) => {
    res.status(200).json({ message: "welcom to our saraha app" }); //.send( "welcom to our saraha app");
  });

  app.use("/auth", authRoutes);

  connection(); // the connection with the data base
  app.all("*", (req, res) => {
    //run when send rong api
    return res.status(400).json({ message: "API not found" });
  });
};

export default bootStrap;
