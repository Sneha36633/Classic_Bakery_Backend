const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.Mixed },
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      image: String,
    }
  ],
  subtotal: { type: Number, required: true },
  deliveryCharge: { type: Number, default: 40 },
  total: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);