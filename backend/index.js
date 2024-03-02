import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()

// process.env.MONGODB_CONNECT
mongoose
  .connect(
    "mongodb+srv://josimarvictoria968:TIKnRpZjPb5c0qhV@dashboard-mern.usnbpo9.mongodb.net/dashboard-mern?retryWrites=true&w=majority&appName=dashboard-mern"
  )
  .then(() => {
    console.log("Mongoose is connected");
  }).catch(err => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server is running on port http://localhost/3000");
});
