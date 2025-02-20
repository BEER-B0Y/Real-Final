import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const OrderTracking = () => {
    const [orderId, setOrderId] = useState("");
    const [trackingData, setTrackingData] = useState(null);
    const [error, setError] = useState("");
    const token = localStorage.getItem("token");

    const fetchTrackingDetails = async (selectedId) => {
        if (!selectedId) return;
        try {
            const response = await axios.get(`http://localhost:5000/api/order-tracking/${selectedId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data) {
                setTrackingData(response.data);
                setError("");
            } else {
                setError("❌ Tracking data not found.");
                setTrackingData(null);
            }
        } catch (err) {
            setError("❌ Failed to fetch tracking details.");
        }
    };

    return (
        <div style={styles.container}>
            <div className="container my-5 p-4 rounded shadow-lg" style={styles.card}>
                <h2 className="text-center fw-bold mb-4" style={styles.title}>
                    Order Tracking
                </h2>

                {error && <p className="alert alert-danger text-center">{error}</p>}

                <div className="mb-4">
                    <label className="fw-bold" style={{ color: "#ffcc00" }}>Select Order ID:</label>
                    <select 
                        className="form-select bg-dark text-light"
                        value={orderId}
                        onChange={(e) => {
                            setOrderId(e.target.value);
                            fetchTrackingDetails(e.target.value);
                        }}
                    >
                        <option value="">-- Select Order --</option>
                        <option value="1">Order 1</option>
                        <option value="2">Order 2</option>
                    </select>
                </div>

                {trackingData && (
                    <div className="p-3 mb-4 rounded shadow-sm" style={styles.trackingDetails}>
                        <h4 className="text-center fw-bold" style={{ color: "#ffcc00" }}>Tracking Information</h4>
                        <p className="mb-1"><strong>Tracking ID:</strong> {trackingData.TrackingID}</p>
                        <p className="mb-1"><strong>Order ID:</strong> {trackingData.OrderID}</p>
                        <p className="mb-1">
                            <strong>Status:</strong> 
                            <span className="badge ms-2" style={getStatusStyle(trackingData.Status)}>
                                {trackingData.Status}
                            </span>
                        </p>
                        <p className="mb-1"><strong>Updated At:</strong> {new Date(trackingData.UpdatedAt).toLocaleString()}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const getStatusStyle = (status) => ({
    backgroundColor: status === "Shipped" ? "#2a9d8f" : "#ff9900",
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
    trackingDetails: {
        backgroundColor: "#2b2b2b",
        borderRadius: "10px",
        padding: "15px",
        color: "#fff"
    }
};

export default OrderTracking;
