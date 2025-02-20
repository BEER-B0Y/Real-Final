import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:5000/api/products", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setProducts(res.data.products))
        .catch(() => setError("Unauthorized access. Please login."));
    }, [token]);

    const handleQuantityChange = (productID, value) => {
        setQuantity((prev) => ({ ...prev, [productID]: value }));
    };

    const handleAddToCart = async (product) => {
        const selectedQuantity = quantity[product.ProductID] || 1;
        try {
            const cartData = { 
                ProductID: product.ProductID, 
                Quantity: selectedQuantity, 
                CustomerID: 1
            };

            console.log("Adding to Cart:", cartData);

            const response = await axios.post(
                "http://localhost:5000/api/cart",
                cartData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status === "success") {
                setSuccess("Item added to cart!");
            } else {
                setError("Failed to add item to cart.");
            }
        } catch (err) {
            setError("Error adding item to cart.");
        }

        setTimeout(() => {
            setSuccess("");
            setError("");
        }, 2000);
    };

    return (
        <div style={styles.container}>
            <div className="container my-5 p-4 rounded shadow-lg" style={styles.card}>
                <h2 className="text-center fw-bold mb-4" style={styles.title}>Products</h2>

                {success && <p className="alert alert-success text-center">{success}</p>}
                {error && <p className="alert alert-warning text-center">{error}</p>}

                <div className="row">
                    {products.map((p) => (
                        <div key={p.ProductID} className="col-lg-3 col-md-6 mb-3">
                            <div className="card shadow-sm p-2 border-0" style={styles.productCard}>
                                <div className="card-body">
                                    <h5 className="fw-bold" style={styles.productName}>{p.ProductName}</h5>
                                    <p style={styles.description}>{p.Description}</p>
                                    <p className="fw-bold fs-5" style={styles.price}>{parseFloat(p.Price).toLocaleString()} บาท</p>
                                    
                                    <div className="mb-3">
                                        <label className="form-label" style={styles.label}>จำนวน:</label>
                                        <input 
                                            type="number" 
                                            className="form-control bg-dark text-light" 
                                            value={quantity[p.ProductID] || 1} 
                                            min="1"
                                            onChange={(e) => handleQuantityChange(p.ProductID, parseInt(e.target.value))}
                                        />
                                    </div>

                                    <button 
                                        className="btn w-100"
                                        style={styles.button}
                                        onClick={() => handleAddToCart(p)}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 0",
    },
    card: {
        backgroundColor: "#1e1e1e",
        color: "#fff",
        maxWidth: "1000px",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
    },
    title: {
        color: "#ffcc00",
        fontSize: "1.8rem",
        fontWeight: "bold",
        textAlign: "center",
    },
    productCard: {
        backgroundColor: "#2b2b2b",
        borderRadius: "10px",
        padding: "15px",
        color: "#fff",
    },
    productName: {
        color: "#ffcc00",
    },
    description: {
        color: "#ffffff", // คำอธิบายสินค้าเป็นสีขาว
    },
    price: {
        color: "#ffcc00",
    },
    label: {
        color: "#ffcc00",
    },
    button: {
        backgroundColor: "#ff9900",
        color: "#000",
        padding: "10px",
        borderRadius: "5px",
        fontWeight: "bold",
        border: "none",
        cursor: "pointer",
        transition: "0.3s",
    }
};

export default Products;
