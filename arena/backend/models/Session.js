const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
        },
        customerName: {
            type: String,
            trim: true,
        },
        station: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        game: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
        },
        startTime: {
            type: Date,
            default: Date.now,
        },
        endTime: {
            type: Date,
        },
        duration: {
            type: Number, // in minutes
        },
        totalAmount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ["active", "completed", "extended"],
            default: "active",
        },
    },
    { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
