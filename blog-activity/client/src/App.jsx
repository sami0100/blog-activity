import React, { useEffect, useState } from "react";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    setLoading(true);
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }

  useEffect(() => { fetchPosts(); }, []);

  async function addPost(e) {
    e.preventDefault();
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content })
    });
    setTitle(""); setContent("");
    fetchPosts();
  }

  async function remove(id) {
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  }

  return (
    <div style={{ maxWidth: 720, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>Mini Blog</h1>
      <form onSubmit={addPost} style={{ display: "grid", gap: "0.5rem" }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Content" required rows={4} />
        <button type="submit">Add Post</button>
      </form>

      <hr style={{ margin: "1.5rem 0" }} />

      {loading ? <p>Loading…</p> : (
        posts.length === 0 ? <p>No posts yet.</p> : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {posts.map(p => (
              <li key={p._id} style={{ padding: "1rem 0", borderBottom: "1px solid #ddd" }}>
                <h3 style={{ margin: 0 }}>{p.title}</h3>
                <p style={{ whiteSpace: "pre-wrap" }}>{p.content}</p>
                <small>{new Date(p.createdAt).toLocaleString()}</small><br/>
                <button onClick={() => remove(p._id)} style={{ marginTop: "0.5rem" }}>Delete</button>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}