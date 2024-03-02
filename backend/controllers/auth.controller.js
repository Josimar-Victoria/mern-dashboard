import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const singupAuthController = async (req, res) => {
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
      return res.status(400).json({ message: "Please fill in all fields" });
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
    res.status(500).json({ message: "Server error" });
  }
}; //
