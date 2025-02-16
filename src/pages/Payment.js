import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
    const [paymentMethod, setPaymentMethod] = useState("");
    const navigate = useNavigate();

    const handlePayment = () => {
        if (!paymentMethod) {
            alert("❌ Please select a payment method!");
            return;
        }
        alert(`✅ Payment Successful via ${paymentMethod}!`);
        navigate("/"); // ✅ กลับไปหน้า Home หลังจากชำระเงินสำเร็จ
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>💳 Payment Page</h2>
            <p style={styles.subtitle}>Please select your preferred payment method:</p>

            <div style={styles.paymentOptions}>
                <label style={styles.option}>
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Credit Card"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    /> 
                    💳 Credit Card
                </label>
                <label style={styles.option}>
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="PayPal"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    /> 
                    🅿️ PayPal
                </label>
                <label style={styles.option}>
                    <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="Bank Transfer"
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    /> 
                    🏦 Bank Transfer
                </label>
            </div>

            <button style={styles.btnPayment} onClick={handlePayment}>
                ✅ Complete Payment
            </button>
        </div>
    );
};

// ✅ CSS Style
const styles = {
    container: {
        maxWidth: "600px",
        margin: "40px auto",
        textAlign: "center",
        backgroundColor: "#f1faee",
        padding: "30px",
        borderRadius: "12px",
    },
    title: {
        fontSize: "2rem",
        fontWeight: "bold",
        marginBottom: "20px",
        color: "#1d3557",
    },
    subtitle: {
        fontSize: "1.2rem",
        marginBottom: "15px",
        color: "#555",
    },
    paymentOptions: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        textAlign: "left",
        marginBottom: "20px",
    },
    option: {
        fontSize: "1.2rem",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
    },
    btnPayment: {
        background: "#1d3557",
        color: "white",
        border: "none",
        padding: "12px 20px",
        cursor: "pointer",
        borderRadius: "8px",
        fontSize: "1.2rem",
        transition: "0.3s",
    },
};

export default Payment;
