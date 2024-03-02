import jwt from "jsonwebtoken";
import { errorHendler } from "./error.js";

// Middleware para verificar la autenticación mediante token JWT
export const verifyToken = (req, res, next) => {
  // Extraer el token de las cookies
  const token = req.cookies.access_token;

  // Verificar la validez del token
  jwt.verify(token, 'HgKiasklqi7KAQI1hoq1', (err, user) => {
    if (err) {
      // Manejar el caso de token no válido
      return next(errorHendler(401, "Unauthorized"));
    }

    // Almacenar la información del usuario en el objeto de solicitud
    req.user = user;
    next();
  });
};
