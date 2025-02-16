import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/register", { fullName, email, password });
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Error registering");
    }
  };

  return (
    <div className="container mt-5">
    <h2 className="text-center mb-4">Register</h2>
    <form onSubmit={handleRegister} className="w-50 mx-auto p-4 border rounded shadow">
        <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input 
                type="text" 
                className="form-control" 
                id="fullName" 
                placeholder="Enter your full name" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                required 
            />
        </div>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="Enter your email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
                type="password" 
                className="form-control" 
                id="password" 
                placeholder="Enter your password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
            />
        </div>
        <button type="submit" className="btn btn-primary w-100">Register</button>
    </form>
</div>

  );
}

export default Register;
