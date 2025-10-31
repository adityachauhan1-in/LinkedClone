import React , {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const res = await axios.post("http://localhost:5000/api/auth/login", {
            email,
            password,
          });
          localStorage.setItem("token", res.data.token);
          alert("Login successful!");
          navigate("/feed")
        } catch (err) {
          console.error(err.response?.data || err.message);
          alert("Invalid credentials");
        }
      }

    return (
     <>
     <div className="flex justify-center items-center h-screen bg-gray-100">
 <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md w-80" >

        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
{/* email */}
<input
type="email"
 placeholder="Email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full mb-4 p-2 border border-gray-300 rounded"
 required />
{/* Password */}
 <input
   type="password"
   placeholder="Password"
   value={password}
   onChange={(e) => setPassword(e.target.value)}
   className="w-full mb-6 p-2 border border-gray-300 rounded"
   required
 />

 <button type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition" >
  Login
  </button>
      </form>
 </div>
     </>
    )
}
export default Login