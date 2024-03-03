// Importar los módulos necesarios
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Importar módulos de rutas
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Establecer el puerto en el cual el servidor escuchará
const PORT = 8000;

// Crear una instancia de la aplicación Express
const app = express();

// Middleware para analizar las solicitudes JSON
app.use(express.json());

// Middleware para analizar cookies
app.use(cookieParser());

// Conectar a la base de datos MongoDB
mongoose
  .connect(
    "mongodb+srv://josimarvictoria968:TIKnRpZjPb5c0qhV@dashboard-mern.usnbpo9.mongodb.net/dashboard-mern?retryWrites=true&w=majority&appName=dashboard-mern"
  )
  .then(() => {
    console.log("Mongoose está conectado");
  })
  .catch((err) => {
    console.log(err);
  });

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});

// Definir rutas para usuarios y autenticación
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/post', postRoutes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  // Establecer el código de estado predeterminado en 500 (Error Interno del Servidor)
  const codigoEstado = err.codigoEstado || 500;

  // Establecer el mensaje de error predeterminado
  const mensaje = err.mensaje || "Internal Server Error";

  // Enviar respuesta JSON con detalles del error
  res.status(codigoEstado).json({
    éxito: false,
    codigoEstado,
    mensaje,
  });
});
