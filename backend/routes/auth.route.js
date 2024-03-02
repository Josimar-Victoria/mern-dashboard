// Importar módulos necesarios
import express from "express";
import { singupAuthController } from "../controllers/auth.controller.js";

// Crear un enrutador para manejar las rutas
const router = express.Router();

// Definir la ruta para el registro de usuarios
router.post("/signup", singupAuthController);

// Exportar el enrutador para su uso en otras partes de la aplicación
export default router;
