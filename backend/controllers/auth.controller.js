// Importar módulos necesarios
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHendler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Controlador para el registro de usuarios
export const singupAuthController = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    next(error);
  }
};

// Controlador para el inicio de sesión de usuarios
export const signinAuthController = async (req, res, next) => {
  const { email, password } = req.body;

  // Verificar campos requeridos
  if (!email || !password || email === "" || password === "") {
    res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Buscar al usuario en la base de datos
    const validUser = await User.findOne({ email });

    // Si el usuario no se encuentra, devolver un error
    if (!validUser) {
      res.status(400).json({ message: "User not found" });
    }

    // Validar la contraseña utilizando bcrypt
    const validPassword = bcrypt.compareSync(password, validUser.password);

    // Si la contraseña no es válida, devolver un error
    if (!validPassword) {
      res.status(400).json({ message: "Invalid password" });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      "HgKiasklqi7KAQI1hoq1"
    );

    // Extraer la contraseña del objeto de usuario y enviar el resto de los datos
    const { password: pass, ...rest } = validUser._doc;

    // Enviar una respuesta exitosa con el token y los datos del usuario
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    // Manejo de errores
    next(error);
  }
};

// Controlador para iniciar sesión o crear usuario  con google
export const googleAuthController = async (req, res, next) => {
  // Obtener datos del usuario desde la solicitud
  const { email, name, googlePhotoUrl } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const user = await User.findOne({ email });

    if (user) {
      // Generar token JWT para el usuario existente
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        "HgKiasklqi7KAQI1hoq1"
      );

      // Eliminar la contraseña de la respuesta
      const { password, ...rest } = user._doc;

      // Enviar respuesta al cliente con token y datos del usuario
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      // Generar una contraseña aleatoria
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // Hash de la contraseña
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      // Crear un nuevo usuario en la base de datos
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      await newUser.save();

      // Generar token JWT para el nuevo usuario
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );

      // Eliminar la contraseña de la respuesta
      const { password, ...rest } = newUser._doc;

      // Enviar respuesta al cliente con token y datos del nuevo usuario
      res
        .status(201)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    // Manejar errores durante el proceso
    next(error);
  }
};
