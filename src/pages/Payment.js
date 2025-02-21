import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const PaymentHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderID, setSelectedOrderID] = useState("");
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [searchParams] = useSearchParams();
  const orderID = searchParams.get("orderID");

  useEffect(() => {
    if (orderID) {
      fetchPaymentDetails(orderID);
    }
  }, [orderID]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Orders Data:", response.data);

      if (response.data.orders.length > 0) {
        setOrders(response.data.orders);
        setError("");
      } else {
        setError("❌ No orders found.");
      }
    } catch (err) {
      console.error("❌ Fetch Orders Error:", err);
      setError("❌ Failed to fetch orders.");
    }
  };

  const fetchPaymentDetails = async (orderID) => {
    if (!orderID) return;
    try {
      console.log(`Fetching payment details for Order ID: ${orderID}`);
      const response = await axios.get(
        `http://localhost:5000/api/payments/${orderID}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.OrderID) {
        setPaymentDetails(response.data);
        setError("");
      } else {
        setError("❌ No payment record found.");
        setPaymentDetails(null);
      }
    } catch (err) {
      console.error("❌ Fetch Payment Error:", err);
      setError("❌ Payment details not found for this order.");
      setPaymentDetails(null);
    }
  };

  const handlePayment = async () => {
    if (!selectedOrderID) {
      setError("❌ Please select an Order ID to proceed.");
      return;
    }

    try {
      const selectedOrder = orders.find(
        (o) => o.OrderID === parseInt(selectedOrderID)
      );

      if (!selectedOrder) {
        setError("❌ Order not found.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/payments",
        {
          OrderID: selectedOrderID,
          PaymentMethod: "Credit Card",
          Amount: selectedOrder.TotalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("✅ Payment Success:", response.data);
      setPaymentDetails({
        PaymentID: response.data.PaymentID || "NEW",
        OrderID: selectedOrderID,
        PaymentMethod: "Credit Card",
        Amount: selectedOrder.TotalPrice,
        PaymentDate: new Date().toLocaleString(),
        Status: "Completed",
      });

      alert("✅ Payment Successful!");
    } catch (err) {
      console.error("❌ Payment Error:", err);
      setError("❌ Payment failed. Please try again.");
    }
  };

  // Filter unique orders by OrderID to avoid duplicates in the dropdown
  const uniqueOrders = Array.from(
    new Set(orders.map((order) => order.OrderID))
  ).map((orderID) => orders.find((order) => order.OrderID === orderID));

  return (
    <div
      className="container my-5 p-4 rounded shadow-lg bg-dark"
      style={styles.card}
    >
      <h2 className="text-center fw-bold mb-4" style={styles.title}>
        💳 <span style={{ color: "#ffcc00" }}>Payment History</span>
      </h2>

      {error && <p className="alert alert-danger text-center">{error}</p>}

      <div className="mb-4 text-center">
        <label className="fw-bold" style={{ color: "#ffcc00" }}>
          Select Order ID:{" "}
        </label>
        <select
          className="form-select w-50 mx-auto"
          value={selectedOrderID}
          onChange={(e) => {
            setSelectedOrderID(e.target.value);
            fetchPaymentDetails(e.target.value);
          }}
        >
          <option value="">-- Select Order --</option>
          {uniqueOrders.map((order, index) => (
            <option key={`${order.OrderID}-${index}`} value={order.OrderID}>
              Order {order.OrderID} -{" "}
              {new Date(order.OrderDate).toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {paymentDetails ? (
        <div className="p-3 mb-4 rounded shadow-sm" style={styles.paymentDetails}>
          <h4 className="text-center text-dark fw-bold">Payment Information</h4>
          <p>
            <strong>Payment ID:</strong> {paymentDetails.PaymentID}
          </p>
          <p>
            <strong>Order ID:</strong> {paymentDetails.OrderID}
          </p>
          <p>
            <strong>Payment Method:</strong> {paymentDetails.PaymentMethod}
          </p>
          <p>
            <strong>Amount:</strong>{" "}
            {parseFloat(paymentDetails.Amount).toLocaleString()} บาท
          </p>
          <p>
            <strong>Payment Date:</strong> {paymentDetails.PaymentDate}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className="badge"
              style={getStatusStyle(paymentDetails.Status)}
            >
              {paymentDetails.Status}
            </span>
          </p>
        </div>
      ) : (
        <button className="btn btn-success" onClick={handlePayment}>
          💳 Proceed to Payment
        </button>
      )}
    </div>
  );
};

const getStatusStyle = (status) => {
  switch (status) {
    case "Completed":
      return {
        backgroundColor: "#2a9d8f", // Green
        color: "white",
        padding: "8px 12px",
        borderRadius: "5px",
      };
    case "Pending":
      return {
        backgroundColor: "#ff9900", // Orange
        color: "white",
        padding: "8px 12px",
        borderRadius: "5px",
      };
    default:
      return {
        backgroundColor: "#ddd", // Default
        color: "black",
        padding: "8px 12px",
        borderRadius: "5px",
      };
  }
};

const styles = {
  card: {
    backgroundColor: "#121212",
    color: "#fff",
    maxWidth: "600px",
    margin: "auto",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  },
  paymentDetails: {
    backgroundColor: "#1d1d1d",
    borderRadius: "10px",
    padding: "15px",
    color: "#fff",
  },
  title: {
    color: "#ffcc00",
    fontSize: "1.8rem",
    fontWeight: "bold",
    textAlign: "center",
  },
};

export default PaymentHistory;
