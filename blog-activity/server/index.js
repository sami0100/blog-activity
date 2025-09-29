
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongo:27017/blogdb";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Simple Post schema
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);
const Post = mongoose.model("Post", postSchema);

// Routes
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get("/api/posts", async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

app.post("/api/posts", async (req, res) => {
  const { title, content } = req.body || {};
  if (!title || !content) {
    return res.status(400).json({ error: "title and content are required" });
  }
  const created = await Post.create({ title, content });
  res.status(201).json(created);
});

app.delete("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.status(204).end();
});

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
