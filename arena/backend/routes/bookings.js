const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Game = require("../models/Game");
const Station = require("../models/Station");
const Payment = require("../models/Payment");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/bookings
// @desc    Get all bookings (admin/staff)
// @access  Admin/Staff
router.get("/", protect, authorize("admin", "staff"), async (req, res) => {
    try {
        const { status, date } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (date) filter.bookingDate = date;

        const bookings = await Booking.find(filter)
            .populate("user", "name email phone")
            .populate("game", "title genre platform")
            .populate("station", "name type status pricePerHour")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/bookings/my
// @desc    Get current user's bookings
// @access  Private
router.get("/my", protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("game", "title genre platform")
            .populate("station", "name type pricePerHour")
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/bookings/:id
// @desc    Get booking by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("user", "name email phone")
            .populate("game", "title genre platform")
            .populate("station", "name type status pricePerHour");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Customers can only see their own bookings
        if (
            req.user.role === "customer" &&
            booking.user._id.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   POST /api/bookings
// @desc    Create a booking
// @access  Private
router.post("/", protect, async (req, res) => {
    try {
        const { gameId, stationId, bookingDate, bookingTime, duration } = req.body;

        // Validate game exists
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }

        // Validate station exists and is available
        const station = await Station.findById(stationId);
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }

        // Calculate total price from station
        const totalPrice = station.pricePerHour * duration;

        const booking = await Booking.create({
            user: req.user._id,
            game: gameId,
            station: stationId,
            bookingDate,
            bookingTime,
            duration,
            totalPrice,
            status: "pending",
        });

        // Auto-create a pending payment for this booking
        const durationStr = duration === 1 ? "1 hour" : `${duration} hours`;
        await Payment.create({
            booking: booking._id,
            user: req.user._id,
            customerName: req.user.name,
            amount: totalPrice,
            method: "cash",
            status: "pending",
            description: `${game.title} — ${station.name} (${station.type}) — ${durationStr} — ${bookingDate} ${bookingTime}`,
            transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate("game", "title genre platform")
            .populate("station", "name type pricePerHour");

        res.status(201).json({ booking: populatedBooking });
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   PUT /api/bookings/:id
// @desc    Update a booking
// @access  Admin/Staff
router.put("/:id", protect, authorize("admin", "staff"), async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
            .populate("user", "name email phone")
            .populate("game", "title genre platform")
            .populate("station", "name type pricePerHour");

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   DELETE /api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete("/:id", protect, async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Customers can only cancel their own bookings
        if (
            req.user.role === "customer" &&
            booking.user.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }

        booking.status = "cancelled";
        await booking.save();

        res.json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   POST /api/bookings/:id/start
// @desc    Start a session for a booking
// @access  Admin/Staff
router.post(
    "/:id/start",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id);

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            booking.status = "active";
            await booking.save();

            // Update station status
            await Station.findByIdAndUpdate(booking.station, { status: "In Use" });

            res.json({ message: "Session started", booking });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// @route   POST /api/bookings/:id/end
// @desc    End a session for a booking
// @access  Admin/Staff
router.post(
    "/:id/end",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const booking = await Booking.findById(req.params.id);

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            booking.status = "completed";
            await booking.save();

            // Update station status back to Available
            await Station.findByIdAndUpdate(booking.station, {
                status: "Available",
            });

            res.json({ message: "Session ended", booking });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

module.exports = router;
