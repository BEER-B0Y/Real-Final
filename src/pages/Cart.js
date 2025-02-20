import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.cart.length > 0) {
                setCartItems(response.data.cart);
            } else {
                setError("No items in cart.");
            }
        } catch (err) {
            setError("❌ Failed to fetch cart items.");
        }
    };

    const handleDelete = async (cartID) => {
        if (!window.confirm("Are you sure you want to remove this item?")) return;
        try {
            const response = await axios.delete(`http://localhost:5000/api/cart/${cartID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === "success") {
                setCartItems(cartItems.filter(item => item.CartID !== cartID));
            } else {
                setError("❌ Failed to remove item.");
            }
        } catch (err) {
            setError("❌ Error removing item from cart.");
        }
    };

    const handleRemoveAll = async () => {
        if (!window.confirm("⚠️ Are you sure you want to remove all items from the cart?")) return;

        try {
            const response = await axios.delete("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === "success") {
                setCartItems([]);
            } else {
                setError("❌ Failed to remove all items.");
            }
        } catch (err) {
            setError("❌ Error removing all items.");
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        const totalAmount = cartItems.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0);
        const customerID = cartItems[0]?.CustomerID || 1;

        const orderData = {
            CustomerID: customerID,
            TotalPrice: totalAmount,
            Status: "Pending",
        };

        try {
            const orderResponse = await axios.post("http://localhost:5000/api/orders", orderData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (orderResponse.data.status === "success") {
                const deleteResponse = await axios.delete("http://localhost:5000/api/cart", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (deleteResponse.data.status === "success") {
                    setCartItems([]);
                    navigate(`/orders?id=${orderResponse.data.OrderID}`);
                }
            }
        } catch (err) {
            setError("❌ Error during checkout.");
        }
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0).toLocaleString();
    };

    return (
        <div style={styles.container}>
            <div style={styles.cartBox}>
                <h2 style={styles.title}>Your Shopping Cart</h2>

                {error && <p className="alert alert-danger text-center">{error}</p>}

                {cartItems.length === 0 ? (
                    <p style={styles.emptyCart}>Your cart is empty.</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table" style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item.CartID}>
                                        <td>{item.ProductName}</td>
                                        <td>{parseFloat(item.Price).toLocaleString()} บาท</td>
                                        <td>{item.Quantity}</td>
                                        <td>{(parseFloat(item.Price) * item.Quantity).toLocaleString()} บาท</td>
                                        <td>
                                            <button style={styles.removeButton} onClick={() => handleDelete(item.CartID)}>
                                                ❌ Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <h3 style={styles.totalPrice}>Total Price: {getTotalPrice()} บาท</h3>

                <div className="d-flex justify-content-between mt-4">
                    <button style={styles.backButton} onClick={() => navigate("/products")}>Back to Products</button>
                    <button style={styles.removeAllButton} onClick={handleRemoveAll}>Remove All</button>
                    <button style={styles.checkoutButton} onClick={handleCheckout}>Checkout</button>
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
    cartBox: {
        backgroundColor: "#1e1e1e",
        color: "#fff",
        maxWidth: "900px",
        padding: "30px",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.1)",
    },
    title: {
        color: "#ffcc00",
        fontSize: "1.8rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "20px",
    },
    emptyCart: {
        textAlign: "center",
        fontSize: "1.2em",
        color: "#ffcc00",
    },
    table: {
        backgroundColor: "#1e1e1e",
        color: "#fff",
        border: "1px solid #fff",
    },
    totalPrice: {
        textAlign: "right",
        color: "#ff9900",
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginTop: "20px",
    },
    removeButton: {
        backgroundColor: "#ff9900",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        color: "#fff",
        cursor: "pointer",
    },
    backButton: {
        backgroundColor: "#6c757d",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    removeAllButton: {
        backgroundColor: "#dc3545",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
    checkoutButton: {
        backgroundColor: "#28a745",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
    },
};

export default Cart;
