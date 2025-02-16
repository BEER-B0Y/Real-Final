import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/orders/1", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data && Array.isArray(data.orders) && data.orders.length > 0) {
                setOrderDetails({
                    CustomerID: data.orders[0].CustomerID,
                    OrderDate: data.orders[0].OrderDate,
                    Status: data.orders[0].Status
                });
            } else {
                setOrderDetails(null);
            }
        });

        const savedOrder = JSON.parse(localStorage.getItem("order"));
        if (savedOrder) {
            setOrderItems(savedOrder.orderItems);
        }
    }, [token]);

    const handleOrderConfirm = () => {
        setOrderItems([]);
        setOrderDetails(null);
        localStorage.removeItem("order");
        navigate("/payment");
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>My Orders</h2>
            {orderDetails && orderItems.length > 0 ? (
                <>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th>Customer ID</th>
                                <th>Order Date</th>
                                <th>Status</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems.map((item, index) => (
                                <tr key={index}>
                                    {index === 0 && (
                                        <>
                                            <td rowSpan={orderItems.length}>{orderDetails.CustomerID}</td>
                                            <td rowSpan={orderItems.length}>{new Date(orderDetails.OrderDate).toLocaleString()}</td>
                                            <td rowSpan={orderItems.length} style={styles.status}>{orderDetails.Status}</td>
                                        </>
                                    )}
                                    <td>{item.ProductName}</td>
                                    <td>{item.Quantity}</td>
                                    <td>${parseFloat(item.Price).toLocaleString()}</td>
                                    <td>${(parseFloat(item.Price) * item.Quantity).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h3 style={styles.totalAmount}>Total Amount: ${orderItems.reduce((total, item) => total + (parseFloat(item.Price) * item.Quantity), 0).toLocaleString()}</h3>
                    <button style={styles.btnOrder} onClick={handleOrderConfirm}>Confirm Order</button>
                </>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

const styles = {
    container: { maxWidth: "1200px", margin: "40px auto", textAlign: "center", backgroundColor: "#f8f9fa", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" },
    title: { fontSize: "2.5rem", fontWeight: "bold", marginBottom: "25px", color: "#1d3557" },
    table: { width: "95%", margin: "auto", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "10px", overflow: "hidden", fontSize: "1.2rem" },
    status: { backgroundColor: "#457b9d", color: "white", padding: "10px", borderRadius: "8px" },
    totalAmount: { fontSize: "2rem", fontWeight: "bold", marginTop: "20px", color: "#e63946" },
    btnOrder: { background: "#1d3557", color: "white", border: "none", padding: "15px 25px", cursor: "pointer", borderRadius: "10px", fontSize: "1.3rem", transition: "0.3s", fontWeight: "bold" },
};

export default Orders;
