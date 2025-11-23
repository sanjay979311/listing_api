

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Razorpay instance
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});



// Function to create an order
export const createOrder = async (amount) => {
    console.log("key process.env.RAZORPAY_KEY_ID,", process.env.RAZORPAY_KEY_ID)
    console.log("key process.env.RAZORPAY_KEY_ID,", process.env.RAZORPAY_KEY_SECRET)
    try {
        const options = {
            amount: amount * 100,  // Convert amount to paise (smallest unit in INR)
            currency: 'INR',
            receipt: 'order_receipt_' + new Date().getTime(),
            payment_capture: 1,  // Auto-capture payment
        };

        const order = await razorpay.orders.create(options);
        console.log("Razorpay Order Created:", order);
        return order;
    } catch (error) {
        console.error('Error creating Razorpay order:', error.message);
        throw error;
    }
};

// Function to verify payment signature
export const verifyPayment = (paymentId, orderId, signature) => {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    const generatedSignature = hmac.update(orderId + "|" + paymentId).digest('hex');

    console.log("Generated Signature:", generatedSignature);
    console.log("Received Signature:", signature);

    return generatedSignature === signature;
};
