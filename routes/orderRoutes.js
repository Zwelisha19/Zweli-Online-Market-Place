
const express = require('express');
const { createOrder, getUserOrders } = require('../controllers/ordersController');

const router = express.Router();


router.post('/orders', createOrder);


router.get('/orders/:userId', getUserOrders);

module.exports = router;
