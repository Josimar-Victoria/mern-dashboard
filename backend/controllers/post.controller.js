import Post from '../models/post.model.js';

export const createPostController = async (req, res, next) => {
    console.log(req.body)
  if (!req.user.isAdmin) {
    res.status(403).json({ message: "You are not allowed to create a post'" });
  }
  if (!req.body.title || !req.body.content) {
    res.status(400).json({ message: "You are not allowed to create a post'" });
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
