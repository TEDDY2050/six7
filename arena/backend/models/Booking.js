const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
        },
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
            required: [true, "Game is required"],
        },
        station: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: [true, "Station is required"],
        },
        bookingDate: {
            type: String,
            required: [true, "Booking date is required"],
        },
        bookingTime: {
            type: String,
            required: [true, "Booking time is required"],
        },
        duration: {
            type: Number,
            required: [true, "Duration is required"],
            min: [1, "Duration must be at least 1 hour"],
        },
        totalPrice: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "active", "completed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
