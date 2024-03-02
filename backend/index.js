import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const PORT = 8000;
const app = express();

app.use(express.json());
// app.use(cookieParser());

// process.env.MONGODB_CONNECT
mongoose
  .connect(
    "mongodb+srv://josimarvictoria968:TIKnRpZjPb5c0qhV@dashboard-mern.usnbpo9.mongodb.net/dashboard-mern?retryWrites=true&w=majority&appName=dashboard-mern"
  )
  .then(() => {
    console.log("Mongoose is connected");
  })
  .catch((err) => {
    console.log(err);
  });


app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});