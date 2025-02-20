import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const PaymentHistory = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderID, setSelectedOrderID] = useState("");
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/orders/4", {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.orders.length > 0) {
                setOrders(response.data.orders);
            } else {
                setError("❌ No orders found.");
            }
        } catch (err) {
            setError("❌ Failed to fetch orders.");
        }
    };

    const fetchPaymentDetails = async (orderID) => {
        if (!orderID) return;
        try {
            const response = await axios.get(`http://localhost:5000/api/payments/${orderID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.OrderID) {
                setPaymentDetails(response.data);
            } else {
                setError("❌ No payment found for this order.");
                setPaymentDetails(null);
            }
        } catch (err) {
            setError("❌ Failed to fetch payment details.");
        }
    };

    return (
        <div style={styles.container}>
            <div className="container my-5 p-4 rounded shadow-lg" style={styles.card}>
                <h2 className="text-center fw-bold mb-4" style={styles.title}>
                    History
                </h2>

                {error && <p className="alert alert-danger text-center">{error}</p>}

                <div className="mb-4 text-center">
                    <label className="fw-bold" style={{ color: "#ffcc00" }}>Select Order ID: </label>
                    <select
                        className="form-select w-50 mx-auto bg-dark text-light"
                        value={selectedOrderID}
                        onChange={(e) => {
                            setSelectedOrderID(e.target.value);
                            fetchPaymentDetails(e.target.value);
                        }}
                    >
                        <option value="">-- Select Order --</option>
                        {orders.map((order) => (
                            <option key={order.OrderID} value={order.OrderID}>
                                Order {order.OrderID} - {new Date(order.OrderDate).toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>

                {paymentDetails ? (
                    <div className="p-3 mb-4 rounded shadow-sm" style={styles.paymentDetails}>
                        <h4 className="text-center fw-bold" style={{ color: "#ffcc00" }}>Payment Information</h4>
                        <p><strong>Payment ID:</strong> {paymentDetails.PaymentID}</p>
                        <p><strong>Order ID:</strong> {paymentDetails.OrderID}</p>
                        <p><strong>Payment Method:</strong> {paymentDetails.PaymentMethod}</p>
                        <p><strong>Amount:</strong> {parseFloat(paymentDetails.Amount).toLocaleString()} บาท</p>
                        <p><strong>Payment Date:</strong> {new Date(paymentDetails.PaymentDate).toLocaleString()}</p>
                        <p>
                            <strong>Status:</strong> 
                            <span className="badge ms-2" style={getStatusStyle(paymentDetails.Status)}>
                                {paymentDetails.Status}
                            </span>
                        </p>
                    </div>
                ) : (
                    <p className="text-center text-danger fs-4"></p>
                )}
            </div>
        </div>
    );
};

const getStatusStyle = (status) => ({
    backgroundColor: status === "Completed" ? "#2a9d8f" : "#ff9900",
    color: "white",
    padding: "8px 12px",
    borderRadius: "5px"
});

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
        maxWidth: "600px",
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
    paymentDetails: {
        backgroundColor: "#2b2b2b",
        borderRadius: "10px",
        padding: "15px",
        color: "#fff"
    }
};

export default PaymentHistory;
