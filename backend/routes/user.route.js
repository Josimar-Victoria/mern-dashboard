// Importar módulos necesarios
import express from "express";
import {
  getAllUsersController,
  updateUsersController,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// Crear un enrutador para manejar las rutas
const router = express.Router();

// Definir la ruta para el usuario
router.get("/", getAllUsersController);
router.put("/update/:userId", verifyToken, updateUsersController);

// Exportar el enrutador para su uso en otras partes de la aplicación

export default router;
