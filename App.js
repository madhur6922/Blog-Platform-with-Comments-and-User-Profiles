import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/blogs")
      .then(res => setBlogs(res.data))
      .catch(err => console.log(err));
  }, []);

  const addBlog = () => {
    axios.post("http://localhost:5000/blogs", {
      title,
      content,
      authorId: "671fb43b5e4c1a20f05a1212" // Example user ID
    })
      .then(res => setBlogs([...blogs, res.data]));
    setTitle("");
    setContent("");
  };

  return (
    <div style={{ margin: "40px" }}>
      <h1>📝 Blog Platform</h1>
      <input placeholder="Blog Title" value={title} onChange={e => setTitle(e.target.value)} />
      <textarea placeholder="Blog Content" value={content} onChange={e => setContent(e.target.value)} />
      <button onClick={addBlog}>Add Blog</button>

      <h2>All Blogs</h2>
      {blogs.map(blog => (
        <div key={blog._id} style={{ border: "1px solid #ddd", marginBottom: "10px", padding: "10px" }}>
          <h3>{blog.title}</h3>
          <p>{blog.content}</p>
          <small>Author: {blog.author?.username}</small>
        </div>
      ))}
    </div>
  );
}

export default App;
