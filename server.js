const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/db');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

app.get('/', (req, res) => res.send('Classic Bakery API Running ✅'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));