// import mongoose from "mongoose";

// const saleEntrySchema = new mongoose.Schema(
//     {
//         saleId: { type: String, unique: true, required: true }, // Unique Sale ID
//         customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//         employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//         items: [
//             {
//                 product: { type: String, required: true }, // Can be ObjectId if you're using a Product model
//                 productCode: String,
//                 price: Number,
//                 batchNumber: String,
//                 expDate: String,
//                 quantity: Number,
//                 mrp: Number,
//                 storePrice: String,
//                 discount: Number,
//                 sgstPercent: Number,
//                 cgstPercent: Number,
//                 igstPercent: Number,
//                 hsn: String,
//                 isTaxable: Boolean,
//                 maxDiscount: Number,
//                 stock: Number,
//                 isFreeShipping: Boolean,
//                 shippingCost: Number,
//                 category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
//                 subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
//                 grossAmount: Number,
//                 discountAmt: Number,
//                 sgst: Number,
//                 cgst: Number,
//                 igst: Number,
//                 shipping: Number,
//                 amount: Number
//             }
//         ],
//         totalAmount: { type: Number, required: true }, // Total of all item.amount
//         paymentMethod: {
//             type: String,
//             enum: ["Cash", "Credit", "Debit", "UPI", "Net Banking"],
//             default: "Cash"
//         },
//         paymentStatus: {
//             type: String,
//             enum: ["Pending", "Paid", "Failed"],
//             default: "Pending"
//         },
//         status: {
//             type: String,
//             enum: [
//                 "Pending",        // Entry made but not finalized
//                 "Completed",      // Sale completed
//                 "Cancelled",      // Entry canceled
//                 "Returned",       // Items returned
//                 "Refunded"        // Amount refunded
//             ],
//             default: "Pending"
//         }
//     },
//     { timestamps: true } // adds createdAt and updatedAt
// );

// export default mongoose.model("SaleEntry", saleEntrySchema);


import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    batchNumber: { type: String },
    expDate: { type: String },
    mrp: { type: Number },
    storePrice: { type: Number },
    discount: { type: Number },
    sgstPercent: { type: Number },
    cgstPercent: { type: Number },
    igstPercent: { type: Number },
    sgst: { type: Number },
    cgst: { type: Number },
    igst: { type: Number },
    discountAmt: { type: Number },
    shipping: { type: Number },
    hsn: { type: String },
    isTaxable: { type: Boolean, default: false },
    isFreeShipping: { type: Boolean, default: false },
    grossAmount: { type: Number },
    amount: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
});

const saleEntrySchema = new mongoose.Schema(
    {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        email: { type: String },
        mobileNo: { type: String },
        address: { type: String },
        gst_number: { type: String },
        items: [saleItemSchema],
        totals: {
            gross: { type: Number },
            discount: { type: Number },
            sgst: { type: Number },
            cgst: { type: Number },
            igst: { type: Number },
            shipping: { type: Number },
            finalAmount: { type: Number }
        },
        additionalDiscount: { type: Number, default: 0 },
        paidAmount: { type: Number, default: 0 },
        balanceAmount: { type: Number },
        paymentMode: {
            type: String,
            enum: ["Cash", "Credit", "Debit", "UPI", "Net Banking"],
            default: "Cash"
        }
    },
    { timestamps: true }
);

export default mongoose.model("SaleEntry", saleEntrySchema);
