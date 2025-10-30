const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// ====== SCHEMAS ======

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bio: String,
  profilePic: String,
});
const User = mongoose.model("User", UserSchema);

// Blog Schema
const BlogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", BlogSchema);

// Comment Schema
const CommentSchema = new mongoose.Schema({
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  createdAt: { type: Date, default: Date.now },
});
const Comment = mongoose.model("Comment", CommentSchema);

// ====== AUTH ROUTES ======
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashed });
  await newUser.save();
  res.json({ message: "User registered successfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(400).json({ error: "Invalid password" });

  const token = jwt.sign({ id: user._id }, "secretkey");
  res.json({ token });
});

// ====== BLOG ROUTES ======
app.get("/blogs", async (req, res) => {
  const blogs = await Blog.find().populate("author", "username");
  res.json(blogs);
});

app.post("/blogs", async (req, res) => {
  const { title, content, authorId } = req.body;
  const newBlog = new Blog({ title, content, author: authorId });
  await newBlog.save();
  res.json(newBlog);
});

// ====== COMMENT ROUTES ======
app.post("/comments", async (req, res) => {
  const { blogId, authorId, content } = req.body;
  const comment = new Comment({ blogId, author: authorId, content });
  await comment.save();
  res.json(comment);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
