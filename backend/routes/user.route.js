// Importar módulos necesarios
import express from "express";
import {
  deleteUsersController,
  getAllUsersController,
  getUserController,
  signoutUserController,
  updateUsersController,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// Crear un enrutador para manejar las rutas
const router = express.Router();

// Definir la ruta para el usuario
router.get("/getusers",verifyToken, getAllUsersController);
router.put("/update/:userId", verifyToken, updateUsersController);
router.delete("/delete/:userId", verifyToken, deleteUsersController);
router.post("/signout", signoutUserController);
router.get('/:userId', getUserController);

// Exportar el enrutador para su uso en otras partes de la aplicación

export default router;
