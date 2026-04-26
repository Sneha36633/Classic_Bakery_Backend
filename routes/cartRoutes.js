const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.post('/place-order', protect, placeOrder);
router.get('/my-orders', protect, getMyOrders);

module.exports = router;