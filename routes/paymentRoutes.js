


import express from 'express';
import { createOrderController, verifyPaymentController } from '../controllers/paymentController.js';

const router = express.Router();

// Route to create a Razorpay order
router.post('/create-order', createOrderController);

// Route to verify payment
router.post('/verify-payment', verifyPaymentController);

export default router;

