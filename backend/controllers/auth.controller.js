// Importar módulos necesarios
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHendler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Controlador para el registro de usuarios
export const singupAuthController = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  try {
    // Verificar campos requeridos
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

    // Hashear la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Guardar el nuevo usuario en la base de datos
    await newUser.save();

    // Respuesta exitosa
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // Manejo de errores
    console.log(error);
    next(error);
  }
};

// Controlador para el inicio de sesión de usuarios
export const signinAuthController = async (req, res, next) => {
  const { email, password } = req.body;

  // Verificar campos requeridos
  if (!email || !password || email === "" || password === "") {
    next(errorHendler(400, "All fields are required"));
  }

  try {
    // Buscar al usuario en la base de datos
    const validUser = await User.findOne({ email });

    // Si el usuario no se encuentra, devolver un error
    if (!validUser) {
      return next(errorHendler(404, "User not found"));
    }

    // Validar la contraseña utilizando bcrypt
    const validPassword = bcrypt.compareSync(password, validUser.password);

    // Si la contraseña no es válida, devolver un error
    if (!validPassword) {
      return next(errorHendler(400, "Invalid password"));
    }

    // Generar un token JWT
    const token = jwt.sign({ id: validUser._id }, "HgKiasklqi7KAQI1hoq1");

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
