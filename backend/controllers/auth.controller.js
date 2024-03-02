import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHendler } from "../utils/error.js";

export const singupAuthController = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  try {
    if (
      !username ||
      !email ||
      !password ||
      username === "" ||
      email === "" ||
      password === ""
    ) {
      next(errorHendler(400, "All fields are required"));
    }
    const hashedPaawords = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPaawords,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    next(error);
  }
}; //
