


import { createOrder, verifyPayment } from '../services/razorpayService.js';
import Payment from '../models/Payment.js';
import mongoose from 'mongoose';

// Controller to handle creating a Razorpay order
export const createOrderController = async (req, res) => {
    const { amount } = req.body;

    try {
        const order = await createOrder(amount);  // Create order using Razorpay service
        console.log("Created Order:", order);

        // Send order details as response
        res.json({ order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error.message);
        res.status(500).json({ message: 'Error creating Razorpay order', error: error.message });
    }
};

// Controller to handle payment verification
export const verifyPaymentController = async (req, res) => {
    console.log("verifyPaymentController hit with body:", req.body);  // Log to check if the controller is being hit

    const { paymentId, orderId, signature, userId, amount } = req.body;  // Added userId for saving payment data

    // Start MongoDB session for transaction handling
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Verify the payment using Razorpay service
        const isVerified = verifyPayment(paymentId, orderId, signature);

        if (isVerified) {
            console.log("Payment Verified:", paymentId, orderId, signature);

            // Validate userId
            if (!userId) {
                return res.status(400).json({ success: false, message: 'User ID is required' });
            }

            // Prepare payment data to be saved
            const payment = new Payment({
                orderId,
                paymentId,
                signature,
                amount,  // Use the amount passed with the request
                status: 'completed',  // Payment is completed
                userId,  // Assuming userId is passed with the request
            });

            // Log payment data before saving to check the values
            console.log("Payment Data to Save:", payment);

            // Save payment to MongoDB within a transaction
            const savedPayment = await payment.save({ session });
            console.log("Saved Payment:", savedPayment);

            // Commit transaction
            await session.commitTransaction();

            // Respond with success message
            res.json({ success: true, message: 'Payment verified and saved successfully' });
        } else {
            console.error("Payment verification failed:", paymentId, orderId);
            res.status(400).json({ success: false, message: 'Invalid signature' });
        }
    } catch (error) {
        // Rollback transaction in case of error
        await session.abortTransaction();
        console.error("Error in verifying payment:", error.message);
        res.status(500).json({ success: false, message: 'Error in verifying payment', error: error.message });
    } finally {
        // End the session regardless of success or failure
        session.endSession();
    }
};
