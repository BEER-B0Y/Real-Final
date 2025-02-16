import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                login(data.token);
                navigate("/"); // กลับไปหน้า Home
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError("Login failed. Try again.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Login</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleLogin} className="w-50 mx-auto p-4 border rounded shadow">
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
                <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
        </div>

    );
};

export default Login;
