import mongoose from 'mongoose';

// Define the payment schema
const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,  // Ensuring the order ID is unique
    },
    paymentId: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'failed-verification'],
        default: 'pending',  // Default payment status is pending
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the user making the payment
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model from the schema
const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
