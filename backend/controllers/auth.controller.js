// Importar módulos necesarios
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHendler } from "../utils/error.js";

// Controlador para el registro de usuarios
export const singupAuthController = async (req, res, next) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  try {
    // Verificar campos requeridos
    if (!username || !email || !password || username === "" || email === "" || password === "") {
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
