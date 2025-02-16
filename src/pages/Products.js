import React, { useEffect, useState } from "react";

function Products({ cart, setCart }) { // รับ cart และ setCart จาก props
  const [products, setProducts] = useState([
    { ProductID: 1, ProductName: "โทรศัพท์มือถือ", Price: 12900 },
    { ProductID: 2, ProductName: "แล็ปท็อป", Price: 35900 },
    { ProductID: 3, ProductName: "เครื่องซักผ้า", Price: 8900 },
    { ProductID: 4, ProductName: "ลิปสติก", Price: 350 },
    { ProductID: 5, ProductName: "เสื้อยืด", Price: 199 }
  ]);
  const [error, setError] = useState("");

  const addToCart = (product) => {
    if (!product || !product.ProductID) {
      alert("Invalid product data");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.ProductID === product.ProductID);
      if (existingItem) {
        return prevCart.map((item) =>
          item.ProductID === product.ProductID ? { ...item, Quantity: item.Quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, Quantity: 1 }];
      }
    });

    alert("Product added to cart!");
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Products</h2>
      {error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <div style={styles.grid}>
          {products.map((p) => (
            <div key={p.ProductID} style={styles.card}>
              <h3 style={styles.productName}>{p.ProductName}</h3>
              <p style={styles.price}>${p.Price.toFixed(2)}</p>
              <button style={styles.button} onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
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
    padding: "20px",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px",
  },
  error: {
    color: "#ff5555",
    fontSize: "1.1rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    width: "90%",
    maxWidth: "1000px",
  },
  card: {
    backgroundColor: "#1e1e1e",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(255, 255, 255, 0.1)",
    textAlign: "center",
    transition: "transform 0.2s ease, box-shadow 0.3s ease",
  },
  productName: {
    fontSize: "1.5rem",
    marginBottom: "10px",
    color: "#fff",
  },
  price: {
    fontSize: "1.2rem",
    marginBottom: "10px",
    color: "#ffcc00",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#ff9900",
    color: "#121212",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
};

export default Products;
