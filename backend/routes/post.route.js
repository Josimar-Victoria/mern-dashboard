// Importar módulos necesarios
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { createPostController, getAllPostController } from "../controllers/post.controller.js";

// Crear un enrutador para manejar las rutas
const router = express.Router();

// Definir la ruta para el registro de usuarios
router.post("/create", verifyToken, createPostController);
router.get("/getposts", verifyToken, getAllPostController);

// Exportar el enrutador para su uso en otras partes de la aplicación
export default router;