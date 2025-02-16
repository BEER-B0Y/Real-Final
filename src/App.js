import React, { useContext, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import { AuthContext } from "./AuthContext";

function App() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [cart, setCart] = useState([]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="App">
            <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">MyShop</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            {user ? (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/products">Products</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/orders">Orders</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/cart">Cart ({cart.length})</Link>
                                    </li>
                                    <li className="nav-item">
                                        <button onClick={handleLogout} className="btn btn-danger ms-2">Logout</button>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">Login</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/register">Register</Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products cart={cart} setCart={setCart} />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
            </Routes>
        </div>
    );
}

export default App;
