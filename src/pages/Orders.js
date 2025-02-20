import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const OrdersAndPayment = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderID, setSelectedOrderID] = useState("");
    const [orderDetails, setOrderDetails] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/orders/4", {
                headers: { Authorization: `Bearer ${token}` }
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

    const fetchOrderDetails = async (orderID) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/orders/order/${orderID}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.OrderID) {
                setOrderDetails(response.data);
                setError("");
            } else {
                setError("❌ Order not found.");
                setOrderDetails(null);
            }
        } catch (err) {
            setError("❌ Failed to fetch order details.");
        }
    };

    const handlePayment = async () => {
        if (!selectedOrderID) {
            alert("❌ Please select an Order!");
            return;
        }
        if (!paymentMethod) {
            alert("❌ Please select a payment method!");
            return;
        }

        const paymentData = {
            OrderID: selectedOrderID,
            PaymentMethod: paymentMethod,
            Amount: orderDetails.TotalPrice,
            PaymentDate: new Date().toISOString().slice(0, 19).replace("T", " "), 
            Status: "Completed"
        };

        try {
            const response = await axios.post("http://localhost:5000/api/payments", paymentData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.status === "success") {
                alert("✅ Payment Successful!");

                await axios.put(`http://localhost:5000/api/orders/${selectedOrderID}`, { Status: "Completed" }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                fetchOrders();
                fetchOrderDetails(selectedOrderID);
            } else {
                setError("❌ Failed to complete payment.");
            }
        } catch (err) {
            setError("❌ Error processing payment.");
        }
    };

    return (
        <div style={styles.container}>
            <div className="container my-5 p-4 rounded shadow-lg" style={styles.card}>
                <h2 className="text-center fw-bold mb-4" style={styles.title}>
                    Order & Payment
                </h2>

                {error && <p className="alert alert-danger text-center">{error}</p>}

                <div className="mb-4">
                    <label className="fw-bold" style={{ color: "#ffcc00" }}>Select Order ID:</label>
                    <select 
                        className="form-select bg-dark text-light"
                        value={selectedOrderID}
                        onChange={(e) => {
                            setSelectedOrderID(e.target.value);
                            fetchOrderDetails(e.target.value);
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

                {orderDetails && (
                    <>
                        <div className="p-3 mb-4 rounded shadow-sm" style={styles.orderDetails}>
                            <h4 className="text-center fw-bold" style={{ color: "#ffcc00" }}>Order Information</h4>
                            <p className="mb-1"><strong>Order ID:</strong> {orderDetails.OrderID}</p>
                            <p className="mb-1"><strong>Total Price:</strong> {parseFloat(orderDetails.TotalPrice).toLocaleString()} บาท</p>
                            <p className="mb-1">
                                <strong>Status:</strong> 
                                <span className="badge ms-2" style={getStatusStyle(orderDetails.Status)}>
                                    {orderDetails.Status}
                                </span>
                            </p>
                        </div>

                        {orderDetails.Status !== "Completed" ? (
                            <>
                                <p className="text-center text-light">Please select your preferred payment method:</p>
                                <div className="d-flex flex-column gap-3 my-4">
                                    {["Credit Card", "PayPal", "Bank Transfer"].map((method) => (
                                        <label 
                                            key={method} 
                                            className="d-flex align-items-center p-3 rounded border bg-dark text-light"
                                            style={styles.option}
                                        >
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value={method}
                                                className="me-2"
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            /> 
                                            {method}
                                        </label>
                                    ))}
                                </div>

                                <div className="d-flex justify-content-center mt-4">
                                    <button 
                                        className="btn btn-lg"
                                        style={styles.btnPayment}
                                        onClick={handlePayment}
                                    >
                                        ✅ Complete Payment
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-success fw-bold">This order has already been paid.</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const getStatusStyle = (status) => ({
    backgroundColor: status === "Completed" ? "#2a9d8f" : "#ff9900",
    color: "white", padding: "8px 12px", borderRadius: "5px"
});

const styles = {
    container: {
        backgroundColor: "#121212",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
    orderDetails: {
        backgroundColor: "#2b2b2b",
        borderRadius: "10px",
        padding: "15px",
        color: "#fff"
    },
    option: {
        fontSize: "1.2rem",
        cursor: "pointer",
    },
    btnPayment: {
        backgroundColor: "#ff9900",
        color: "black",
        padding: "12px 20px",
        borderRadius: "10px",
        fontSize: "1.2rem",
        border: "none",
        cursor: "pointer"
    }
};

export default OrdersAndPayment;
