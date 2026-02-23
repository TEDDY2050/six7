const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/payments
// @desc    Get all payments
// @access  Admin/Staff
router.get("/", protect, authorize("admin", "staff"), async (req, res) => {
    try {
        const { status, method } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (method) filter.method = method;

        const payments = await Payment.find(filter)
            .populate("user", "name email")
            .populate({
                path: "booking",
                populate: [
                    { path: "game", select: "title" },
                    { path: "station", select: "name" },
                ],
            })
            .sort({ createdAt: -1 });

        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Admin/Staff
router.get("/:id", protect, authorize("admin", "staff"), async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate("user", "name email")
            .populate("booking");

        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   POST /api/payments
// @desc    Create a payment
// @access  Admin/Staff
router.post("/", protect, authorize("admin", "staff"), async (req, res) => {
    try {
        const payment = await Payment.create(req.body);

        res.status(201).json(payment);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   POST /api/payments/process/:bookingId
// @desc    Process payment for a booking
// @access  Admin/Staff
router.post(
    "/process/:bookingId",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.bookingId).populate(
                "game"
            );

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            const { method } = req.body;
            const amount = booking.totalPrice || booking.game.pricePerHour * booking.duration;

            const payment = await Payment.create({
                booking: booking._id,
                user: booking.user,
                amount,
                method: method || "cash",
                status: "completed",
                transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            });

            // Update booking status
            booking.status = "confirmed";
            await booking.save();

            res.status(201).json({
                message: "Payment processed successfully",
                payment,
            });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// @route   PUT /api/payments/:id
// @desc    Update payment details (amount, method, etc)
// @access  Admin/Staff
router.put("/:id", protect, authorize("admin", "staff"), async (req, res) => {
    try {
        const { amount, method, status, description, paidAmount } = req.body;

        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }

        if (amount !== undefined) payment.amount = amount;
        if (method) payment.method = method;
        if (status) payment.status = status;
        if (description) payment.description = description;
        if (paidAmount !== undefined) payment.paidAmount = paidAmount;

        await payment.save();

        const updated = await Payment.findById(req.params.id)
            .populate("user", "name email")
            .populate("booking");

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   PATCH /api/payments/:id/collect
// @desc    Mark a payment as collected (update status and method)
// @access  Admin/Staff
router.patch(
    "/:id/collect",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const { method } = req.body;

            const payment = await Payment.findById(req.params.id);
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }

            payment.status = "completed";
            payment.method = method || "cash";
            await payment.save();

            res.json({ message: "Payment collected", payment });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

module.exports = router;
