const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./database");

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const SECRET_KEY = "IT_lannapoly_cnx";

// ✅ Middleware ตรวจสอบ JWT Token
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "❌ No Token Provided" });
  }

  const token = authHeader.split(" ")[1]; // ดึง token จาก "Bearer <token>"
  if (!token) {
    return res.status(403).json({ message: "❌ Token format invalid" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "❌ Unauthorized" });
    }

    req.userId = decoded.id; // ✅ ดึง CustomerID จาก Token
    console.log("🔑 Authenticated CustomerID:", req.userId); // ✅ Debug Log
    next();
  });
};

// ==================== ✅ Authentication API ====================

// 📌 **1. ลงทะเบียน (Register)**
app.post("/api/register", (req, res) => {
  let { fullName, email, password, phone, address } = req.body;

  // ✅ กำหนดค่าเริ่มต้น ถ้าผู้ใช้ไม่กรอก
  if (!phone) phone = "0000000000";
  if (!address) address = "Unknown";

  const hashPassword = bcrypt.hashSync(password, 8);

  db.query(
    "INSERT INTO Customer (FullName, Email, Password, Phone, Address) VALUES (?, ?, ?, ?, ?)",
    [fullName, email, hashPassword, phone, address],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Customer registered successfully" });
    }
  );
});

// 📌 **2. Login**
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM Customer WHERE Email = ?", [email], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0)
      return res.status(401).json({ message: "❌ Invalid email or password" });

    const user = result[0];

    bcrypt.compare(password, user.Password, (err, isMatch) => {
      if (err || !isMatch)
        return res
          .status(401)
          .json({ message: "❌ Invalid email or password" });

      // ✅ Generate Valid JWT Token
      const token = jwt.sign({ id: user.CustomerID }, SECRET_KEY, {
        expiresIn: "2h",
      });

      console.log("✅ Generated Token:", token); // ✅ Debugging

      res.json({ message: "✅ Login successful", token });
    });
  });
});

// 📌 **3. Get User Info (ใช้ใน AuthContext)**
app.get("/api/user", authenticate, (req, res) => {
  db.query(
    "SELECT CustomerID, FullName, Email FROM Customer WHERE CustomerID = ?",
    [req.userId],
    (err, result) => {
      if (err)
        return res.status(500).json({ message: "Database error", error: err });
      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      res.json({ user: result[0] });
    }
  );
});

// ==================== ✅ Products API ====================

// 📌 **ดึงสินค้าทั้งหมด**
app.get("/api/products", (req, res) => {
  db.query("SELECT * FROM Product", (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    res.json({ products: results });
  });
});

// ==================== ✅ Cart API ====================

// 📌 **1. ดึงข้อมูลตะกร้าของลูกค้า**
app.get("/api/cart", authenticate, (req, res) => {
  const CustomerID = req.userId; // ✅ ดึงจาก JWT

  console.log("🛒 Fetching Cart for CustomerID:", CustomerID);

  if (!CustomerID) {
    console.error("❌ Unauthorized: Missing CustomerID from JWT");
    return res
      .status(403)
      .json({ message: "❌ Forbidden: Invalid CustomerID" });
  }

  const sql = `
    SELECT c.CartID, c.ProductID, c.Quantity, p.ProductName, p.Price 
    FROM Cart c 
    JOIN Product p ON c.ProductID = p.ProductID 
    WHERE c.CustomerID = ?`;

  db.query(sql, [CustomerID], (err, results) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    console.log("✅ Cart Items Retrieved:", results); // ✅ Debug ค่าจาก Database
    res.json({ cartItems: results });
  });
});

// 📌 **2. เพิ่มสินค้าลงตะกร้า**
app.post("/api/cart", authenticate, (req, res) => {
  const { ProductID, Quantity } = req.body;
  const CustomerID = req.userId; // ✅ ดึงจาก JWT Middleware

  console.log("📦 New Cart Request:", { ProductID, Quantity, CustomerID });
  console.log("🔑 Received Token:", req.headers["authorization"]); // ✅ Debug Token

  if (!CustomerID) {
    console.error("❌ Error: CustomerID is NULL (JWT issue)");
    return res
      .status(401)
      .json({ message: "❌ Unauthorized - CustomerID missing from JWT" });
  }

  if (!ProductID || !Quantity) {
    console.error("❌ Error: Missing ProductID or Quantity");
    return res
      .status(400)
      .json({ message: "❌ ProductID and Quantity are required" });
  }

  db.query(
    "SELECT * FROM Cart WHERE CustomerID = ? AND ProductID = ?",
    [CustomerID, ProductID],
    (err, result) => {
      if (err) {
        console.error("❌ Database Error (Check SQL Query)", err);
        return res.status(500).json({ message: "Database error", error: err });
      }

      if (result.length > 0) {
        db.query(
          "UPDATE Cart SET Quantity = Quantity + ? WHERE CustomerID = ? AND ProductID = ?",
          [Quantity, CustomerID, ProductID],
          (updateErr) => {
            if (updateErr) {
              console.error("❌ Database Error (Update Query)", updateErr);
              return res
                .status(500)
                .json({ message: "Database error", error: updateErr });
            }
            return res.json({
              status: "success",
              message: "✅ Product quantity updated in cart",
            });
          }
        );
      } else {
        db.query(
          "INSERT INTO Cart (CustomerID, ProductID, Quantity) VALUES (?, ?, ?)",
          [CustomerID, ProductID, Quantity],
          (insertErr) => {
            if (insertErr) {
              console.error("❌ Database Error (Insert Query)", insertErr);
              return res
                .status(500)
                .json({ message: "Database error", error: insertErr });
            }
            res.json({
              status: "success",
              message: "✅ Product added to cart",
            });
          }
        );
      }
    }
  );
});
app.delete("/api/cart/:cartID", authenticate, (req, res) => {
  const { cartID } = req.params;
  db.query("DELETE FROM Cart WHERE CartID = ?", [cartID], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    res.json({ status: "success", message: "✅ Item removed from cart" });
  });
});

app.post("/api/orders", authenticate, (req, res) => {
  const CustomerID = req.userId;
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length === 0) {
    return res
      .status(400)
      .json({ message: "❌ Cart is empty, cannot checkout!" });
  }

  console.log("🛒 Checkout Request from Customer:", CustomerID);
  console.log("📦 Order Items:", cartItems);

  // ✅ 1. คำนวณราคารวม
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.Quantity * item.Price,
    0
  );

  // ✅ 2. สร้าง Order ใหม่ใน `orders`
  const orderSql = `INSERT INTO orders (CustomerID, OrderDate, TotalPrice, Status) VALUES (?, NOW(), ?, 'Pending')`;

  db.query(orderSql, [CustomerID, totalPrice], (err, result) => {
    if (err) {
      console.error("❌ Database Error (Create Order):", err);
      return res
        .status(500)
        .json({ message: "❌ Failed to create order!", error: err });
    }

    const OrderID = result.insertId; // ✅ ได้ OrderID ที่เพิ่งสร้าง

    // ✅ 3. เพิ่มสินค้าไปที่ `orderdetail`
    const orderDetailsSql = `INSERT INTO orderdetail (OrderID, ProductID, Quantity) VALUES ?`;
    const values = cartItems.map((item) => [
      OrderID,
      item.ProductID,
      item.Quantity,
    ]);

    db.query(orderDetailsSql, [values], (detailErr) => {
      if (detailErr) {
        console.error("❌ Database Error (OrderDetails):", detailErr);
        return res.status(500).json({
          message: "❌ Failed to save order details!",
          error: detailErr,
        });
      }

      console.log("✅ Order & Details Saved:", OrderID);

      // ✅ 4. ลบสินค้าจากตะกร้า
      db.query(
        "DELETE FROM cart WHERE CustomerID = ?",
        [CustomerID],
        (deleteErr) => {
          if (deleteErr) {
            console.error("❌ Failed to clear cart after checkout:", deleteErr);
            return res
              .status(500)
              .json({ message: "❌ Order placed but cart was not cleared!" });
          }

          res.json({
            status: "success",
            message: "✅ Order placed successfully!",
          });
        }
      );
    });
  });
});
// 📌 **4. ดึง Order ของลูกค้า**
app.get("/api/orders", authenticate, async (req, res) => {
  const CustomerID = req.userId;

  console.log("📦 Fetching Orders for Customer:", CustomerID);

  if (!CustomerID) {
    return res.status(403).json({ message: "❌ Unauthorized request" });
  }

  const sql = `
      SELECT o.OrderID, o.OrderDate, o.TotalPrice, o.Status, 
             od.ProductID, p.ProductName, od.Quantity
      FROM orders o
      JOIN orderdetail od ON o.OrderID = od.OrderID
      JOIN product p ON od.ProductID = p.ProductID
      WHERE o.CustomerID = ?
      ORDER BY o.OrderDate DESC`;

  try {
    const [results] = await db.promise().query(sql, [CustomerID]);

    if (results.length === 0) {
      return res.status(404).json({ message: "❌ No orders found" });
    }

    console.log("✅ Orders Retrieved:", results);
    res.json({ orders: results });
  } catch (err) {
    console.error("❌ Database Error:", err);
    res
      .status(500)
      .json({ message: "❌ Failed to fetch orders", error: err.message });
  }
});

app.get("/api/payments/:orderID", authenticate, async (req, res) => {
  const orderID = req.params.orderID;

  try {
    const [payments] = await db
      .promise()
      .query("SELECT * FROM payment WHERE OrderID = ?", [orderID]);

    if (payments.length === 0) {
      return res
        .status(404)
        .json({ message: "❌ No payment found for this order." });
    }

    res.json(payments[0]); // ✅ Return payment details
  } catch (err) {
    console.error("❌ Database Error (Fetching Payment):", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

app.post("/api/payments", authenticate, async (req, res) => {
  const { OrderID, PaymentMethod, Amount } = req.body;
  const CustomerID = req.userId; // ✅ Extract from token

  if (!OrderID || !PaymentMethod || !Amount) {
    return res.status(400).json({ message: "❌ Missing required fields" });
  }

  try {
    // ✅ Use `await` for MySQL queries (instead of callback)
    const [order] = await db
      .promise()
      .query("SELECT * FROM orders WHERE OrderID = ?", [OrderID]);

    if (order.length === 0) {
      return res.status(404).json({ message: "❌ Order not found" });
    }

    if (order[0].Status === "Paid") {
      return res.status(400).json({ message: "❌ Order already paid" });
    }

    // ✅ Insert payment record
    await db
      .promise()
      .query(
        "INSERT INTO payment (OrderID, PaymentMethod, Amount, PaymentDate, Status) VALUES (?, ?, ?, NOW(), 'Completed')",
        [OrderID, PaymentMethod, Amount]
      );

    // ✅ Update order status
    await db
      .promise()
      .query("UPDATE orders SET Status = 'Paid' WHERE OrderID = ?", [OrderID]);

    // ✅ Ensure tracking entry exists
    const [tracking] = await db
      .promise()
      .query("SELECT * FROM ordertracking WHERE OrderID = ?", [OrderID]);

    if (tracking.length === 0) {
      await db
        .promise()
        .query(
          "INSERT INTO ordertracking (OrderID, Status, UpdatedAt) VALUES (?, 'Processing', NOW())",
          [OrderID]
        );
    }

    res.json({ status: "success", message: "✅ Payment successful!" });
  } catch (err) {
    console.error("❌ Database Payment Error:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

app.get("/api/order-tracking/:orderID", authenticate, async (req, res) => {
  const orderID = req.params.orderID;

  try {
    const [tracking] = await db
      .promise()
      .query("SELECT * FROM ordertracking WHERE OrderID = ?", [orderID]);

    if (tracking.length === 0) {
      return res
        .status(404)
        .json({ message: "❌ No tracking found for this order." });
    }

    res.json(tracking[0]); // ✅ Return tracking details
  } catch (err) {
    console.error("❌ Database Error (Fetching Tracking):", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
