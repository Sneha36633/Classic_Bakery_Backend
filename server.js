const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
// server.js mein
const allowedOrigins = [
  'https://bakery-website-frontend-flame.vercel.app',
  'https://bakery-website-frontend-h8hr.vercel.app',
  'http://localhost:3000' // Local testing ke liye
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS block kar raha hai: Is URL ko permission nahi hai.'));
    }
  },
  credentials: true // Agar aap cookies ya sessions use kar rahe ho
}));
// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

app.get("/", (req, res) => res.send("Classic Bakery API Running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
