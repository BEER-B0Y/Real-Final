import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderTracking = () => {
    const [trackingData, setTrackingData] = useState(null);
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/order-tracking/4", {
            method: "GET",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
        })
        .then((response) => response.json())
        .then((data) => {
            if (data && data.Status) {
                setTrackingData(data);
            } else {
                setTrackingData(null);
            }
        })
        .catch((error) => {
            console.error("Error fetching order tracking:", error);
            setTrackingData(null);
        });
    }, [token]);

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>📦 Order Tracking</h2>
            {trackingData ? (
                <div style={styles.statusBox}>
                    <p><strong>Order ID:</strong> {trackingData.OrderID}</p>
                    <p><strong>Customer ID:</strong> {trackingData.CustomerID}</p>
                    <p><strong>Tracking Status:</strong> 
                        <span style={{...styles.status, backgroundColor: getStatusColor(trackingData.Status)}}>
                            {trackingData.Status}
                        </span>
                    </p>
                </div>
            ) : (
                <p style={styles.noData}>No tracking data found.</p>
            )}
            <button style={styles.btnBack} onClick={() => navigate("/")}>🏠 Back to Home</button>
        </div>
    );
};

// ✅ ฟังก์ชันกำหนดสีของสถานะ
const getStatusColor = (status) => {
    switch (status) {
        case "Pending": return "#f4a261";
        case "Processing": return "#e9c46a";
        case "Shipped": return "#2a9d8f";
        case "Delivered": return "#264653";
        default: return "#ddd";
    }
};

// ✅ สไตล์
const styles = {
    container: { maxWidth: "600px", margin: "40px auto", textAlign: "center", padding: "20px", backgroundColor: "#f1faee", borderRadius: "12px" },
    title: { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px", color: "#1d3557" },
    statusBox: { fontSize: "1.2rem", backgroundColor: "white", padding: "15px", borderRadius: "8px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" },
    status: { padding: "8px 12px", color: "white", fontWeight: "bold", borderRadius: "5px", marginLeft: "10px" },
    noData: { fontSize: "1.2rem", color: "#e63946" },
    btnBack: { background: "#457b9d", color: "white", padding: "10px 15px", borderRadius: "8px", fontSize: "1rem", cursor: "pointer", marginTop: "20px" }
};

export default OrderTracking;
