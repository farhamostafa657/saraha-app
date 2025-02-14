import * as dotenv from "dotenv";
dotenv.config({});

import express from "express";
import fs from "node:fs"; //for read files in node js
import bootStrap from "./src/app.controller.js";
const app = express();
const port = process.env.PORT || 3000;

bootStrap(app, express);

//study node js file system
// fs.readFile("db.txt", (err, data) => {
//   console.log(data);
// });
// const data = fs.readFileSync("db.txt", "utf8");
// console.log(data);
// fs.writeFileSync('db.txt')

app.listen(port, () => console.log(`Saraha App on http://localhost:${port}`));
