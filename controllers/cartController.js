const Order = require('../models/Order');

// POST /api/cart/place-order
const placeOrder = async (req, res) => {
  const { items, subtotal, deliveryCharge, total } = req.body;
  try {
    const order = await Order.create({
      user: req.user._id,
      items,
      subtotal,
      deliveryCharge,
      total,
    });
    res.status(201).json({ message: 'Order placed successfully!', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/cart/my-orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { placeOrder, getMyOrders };