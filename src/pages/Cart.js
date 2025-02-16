import React from "react";
import { useNavigate } from "react-router-dom";

const Cart = ({ cart, setCart }) => {
    const navigate = useNavigate();

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0).toFixed(2);
    };

    const removeItem = (productID) => {
        const updatedCart = cart.filter(item => item.ProductID !== productID);
        setCart(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
    };

    const handleCheckout = () => {
        if (cart.length === 0) {
            alert("❌ Your cart is empty!");
            return;
        }

        const orderData = {
            orderItems: cart,
            totalAmount: getTotalPrice(),
            status: "Pending",
        };

        localStorage.setItem("order", JSON.stringify(orderData));
        setCart([]);
        navigate("/orders");
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>🛒 Your Shopping Cart</h2>
            {cart.length === 0 ? (
                <p style={styles.emptyCart}>Your cart is empty.</p>
            ) : (
                <>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item) => (
                                <tr key={item.ProductID}>
                                    <td>{item.ProductName}</td>
                                    <td>{item.Quantity}</td>
                                    <td>${parseFloat(item.Price).toFixed(2)}</td>
                                    <td>${(parseFloat(item.Price) * item.Quantity).toFixed(2)}</td>
                                    <td>
                                        <button 
                                            style={styles.btnRemove} 
                                            onClick={() => removeItem(item.ProductID)}
                                        >
                                            ❌ Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 style={styles.total}>Total Price: ${getTotalPrice()}</h3>

                    <div style={styles.buttonContainer}>
                        <button style={styles.btnBack} onClick={() => navigate("/products")}>🔙 Back to Products</button>
                        <button style={styles.btnClear} onClick={clearCart}>🗑 Clear Cart</button>
                        <button style={styles.btnCheckout} onClick={handleCheckout}>💳 Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "900px",
        margin: "40px auto",
        textAlign: "center",
        backgroundColor: "#1e1e1e",
        padding: "20px",
        borderRadius: "10px",
        color: "#fff",
        boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#ffcc00",
    },
    emptyCart: {
        fontSize: "1.2rem",
        color: "#e63946",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#333",
        color: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
    },
    total: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginTop: "20px",
        color: "#ffcc00",
    },
    buttonContainer: {
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        gap: "15px",
    },
    btnBack: {
        background: "#457b9d",
        color: "white",
        border: "none",
        padding: "10px 15px",
        cursor: "pointer",
        borderRadius: "8px",
        fontSize: "1rem",
        transition: "0.3s",
    },
    btnClear: {
        background: "#e63946",
        color: "white",
        border: "none",
        padding: "10px 15px",
        cursor: "pointer",
        borderRadius: "8px",
        fontSize: "1rem",
        transition: "0.3s",
    },
    btnCheckout: {
        background: "#1d3557",
        color: "white",
        border: "none",
        padding: "10px 15px",
        cursor: "pointer",
        borderRadius: "8px",
        fontSize: "1rem",
        transition: "0.3s",
    },
    btnRemove: {
        background: "#e63946",
        color: "white",
        border: "none",
        padding: "5px 10px",
        cursor: "pointer",
        borderRadius: "5px",
        fontSize: "0.9rem",
    },
};

export default Cart;
