import Post from "../models/post.model.js";

// Controlador para la creación de publicaciones
export const createPostController = async (req, res, next) => {
  // Verificar si el usuario tiene permisos de administrador
  if (!req.user.isAdmin) {
    res.status(403).json({ message: "You are not allowed to create a post'" });
  }

  // Verificar si el título o el contenido de la publicación están ausentes en la solicitud
  if (!req.body.title || !req.body.content) {
    res.status(400).json({ message: "You are not allowed to create a post'" });
  }

  // Crear un slug para la publicación a partir del título
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  // Crear una nueva instancia de la clase Post con los datos de la solicitud
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    // Intentar guardar la nueva publicación en la base de datos
    const savedPost = await newPost.save();

    // Si la publicación se guarda con éxito, devolver un código de estado 201
    res.status(201).json(savedPost);
  } catch (error) {
    // Si hay un error al guardar la publicación, pasar el error al siguiente middleware
    next(error);
  }
};

// Controlador para obtener todas las publicaciones con opciones de filtrado y paginación
export const getAllPostController = async (req, res) => {
  try {
    // Obtener el índice de inicio de las publicaciones (por defecto, 0)
    const startIndex = parseInt(req.query.startIndex) || 0;
    // Obtener el límite de publicaciones por página (por defecto, 9)
    const limit = parseInt(req.query.limit) || 9;

    // Determinar la dirección de orden
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    // Consultar las publicaciones en la base de datos con opciones de filtrado
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection }) // Ordenar las publicaciones por fecha de actualización
      .skip(startIndex) // Omitir las publicaciones anteriores al índice de inicio
      .limit(limit); // Limitar la cantidad de publicaciones devueltas

    // Contar el total de publicaciones en la base de datos
    const totalPosts = await Post.countDocuments();

    // Obtener la fecha actual
    const now = new Date();

    // Calcular la fecha hace un mes desde la fecha actual
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // Contar las publicaciones creadas en el último mes
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};
