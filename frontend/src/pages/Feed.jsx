// src/pages/Feed.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Feed() {
  const [content, setContent] = useState("");
const [posts,setPosts]=useState([])
const[user , setUser] = useState(null)
// for logout 
const navigate = useNavigate();
  // for getting the posts 
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/posts");
        setPosts(res.data.reverse());
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchPosts();
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchUser();
    
  }, []);
  
  const handlePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/posts",
        {  text : content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Post created successfully!");
      console.log("Post:", res.data); 
      setContent("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to create post");
    }
  };
// for like the post 
const handleLike = async (postId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `http://localhost:5000/api/posts/${postId}/like`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // Update likes instantly
    setPosts((prev) =>
      prev.map((p) =>
        p._id === postId ? { ...p, likes: Array(res.data.likes).fill("x") } : p
      )
    );
  } catch (err) {
    console.error(err);
  }
};

  return (
     <div className="min-h-screen bg-gray-100">
    <Navbar />
    <div className="flex flex-col items-center p-4">



      <form
        onSubmit={handlePost}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Create a Post</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border border-gray-300 p-2 rounded mb-4"
          rows="4"
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Post
        </button>
      </form>

      {/* All Posts Section */}
<div className="w-full max-w-2xl mt-8 space-y-4">
{posts.map((post) => (
  <div key={post._id} className="bg-white p-4 rounded-2xl shadow">
    <h2 className="font-semibold text-lg text-gray-700">{post.user?.name}</h2>
    <p className="text-gray-600 mt-2">{post.text}</p>
    <span className="text-sm text-gray-400 mt-1 block">
      {new Date(post.createdAt).toLocaleString()}
    </span>

    {/* Like Section */}
    <div className="flex items-center mt-3 space-x-2">
      <button
        onClick={() => handleLike(post._id)}
        className="text-blue-500 hover:underline"
      >
         Like
      </button>
      <span className="text-gray-500 text-sm">
        {post.likes?.length || 0} likes
      </span>
    </div>
  </div>
))}

    </div>
    </div>
    </div>
  );
}

export default Feed;
