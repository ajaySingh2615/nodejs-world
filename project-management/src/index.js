import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const myName = process.env.MY_NAME;
console.log(myName);
