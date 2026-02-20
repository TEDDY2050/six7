const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [0, "Amount cannot be negative"],
        },
        method: {
            type: String,
            enum: ["cash", "card", "upi", "online"],
            default: "cash",
        },
        status: {
            type: String,
            enum: ["pending", "completed", "refunded", "failed"],
            default: "pending",
        },
        transactionId: {
            type: String,
        },
    },
    { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
