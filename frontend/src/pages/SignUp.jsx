import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, // keep form as it is 
        [e.target.name] : e.target.value }); // just change the value i type
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
     
      await axios.post("http://localhost:5000/api/auth/signup", form);
      alert("Signup successful! Please login."); // after successful redirect to login page as happen in linked in 
      navigate("/login");
    } catch (err) {
         alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
         <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
         {/* name  */}
 <input
          className="w-full p-2 mb-3 border rounded"
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required />
{/* email */}
  <input
    className="w-full p-2 mb-3 border rounded"
    type="email"
    name="email"
    placeholder="Email"
    onChange={handleChange}
    required
  />

  {/* Password  */}
 <input
   className="w-full p-2 mb-4 border rounded"
   type="password"
   name="password"
   placeholder="Password"
   onChange={handleChange}
   required
 />

<button  className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition" type="submit" >
          Sign Up </button>

        <p className="mt-3 text-center text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
           </p>
         </form>
     </div>
  );
};

export default Signup;
