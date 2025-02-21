import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";


function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome to 🌞SunShop</h1>
      <p style={styles.subtitle}>Your one-stop shop for amazing products!</p>
      <nav style={styles.nav}>
        <Link to="/products" style={styles.button}>View Products</Link>
        <Link to="/orders" style={styles.button}>My Orders</Link>
        <Link to="/cart" style={styles.button}>My Cart</Link>
      </nav>
    </div>
  );
}

// Styling for dark theme
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#121212",
    color: "#fff",
    textAlign: "center",
    padding: "20px",
  },
  title: {
    fontSize: "3rem",
    marginBottom: "15px",
    color: "#ffcc00",
  },
  subtitle: {
    fontSize: "1.5rem",
    marginBottom: "30px",
    opacity: "0.8",
  },
  nav: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#ff9900",
    color: "#121212",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    textDecoration: "none",
    transition: "background-color 0.3s ease",
  },
  buttonHover: {
    backgroundColor: "#ff7700",
  },
};

export default Home;
