import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";

export const getAllUsersController = (req, res) => {
  res.json({ message: "API IS World!" });
};

//Controlador para actualizar la información de un usuario
export const updateUsersController = async (req, res, next) => {
  // Verifica si el usuario autenticado está intentando actualizar su propio perfil
  if (req.user.id !== req.params.userId) {
    res
      .status(403)
      .json({ message: "You are not allowed to update this user" });
  }

  // Verifica si se proporcionó una contraseña en el cuerpo de la solicitud
  if (req.body.password) {
    // Valida que la contraseña tenga al menos 6 caractere
    if (req.body.password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    // Hashea la contraseña usando bcryptjs
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  // Valida y actualiza el nombre de usuario si está presente en el cuerpo de la solicitud
  if (req.body.username) {
    // Valida que el nombre de usuario tenga entre 7 y 20 caracteres
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      res
        .status(400)
        .json({ message: "Username must be between 7 and 20 characters" });
    }
    // Verifica la presencia de espacios en el nombre de usuario
    if (req.body.username.includes(" ")) {
      res.status(400).json({ message: "Username cannot contain spaces" });
    }
    // Verifica que el nombre de usuario esté en minúsculas
    if (req.body.username !== req.body.username.toLowerCase()) {
      res.status(400).json({ message: "Username must be lowercase" });
    }
    // Valida el formato del nombre de usuario (solo letras y números)
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      res
        .status(400)
        .json({ message: "Username can only contain letters and numbers" });
    }
  }
  try {
    // Actualiza la información del usuario en la base de datos
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    // Excluye la contraseña de la respuesta
    const { password, ...rest } = updatedUser._doc;
    // Envía la información actualizada del usuario en la respuesta
    res.status(200).json(rest);
  } catch (error) {
    // Pasa cualquier error al siguiente middleware
    next(error);
  }
};

//Controlador para eliminar un usuario.
export const deleteUsersController = async (req, res, next) => {
  // Verifica si el usuario actual tiene permisos de administrador o está intentando eliminar su propio usuario.
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    res.status(403).json("You are not allowed to delete this user");
  }
  try {
    // Elimina al usuario según su ID.
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json("User has been deleted");
  } catch (error) {
    // Pasa cualquier error al siguiente middleware.
    next(error);
  }
};

// Controlador para cerrar sesión de un usuario.
export const signout = (req, res, next) => {
  try {
    // Borra la cookie de acceso y responde con un mensaje de éxito.
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    // Pasa cualquier error al siguiente middleware.
    next(error);
  }
};
