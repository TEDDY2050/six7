const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const Station = require("../models/Station");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/sessions/active
// @desc    Get all active sessions
// @access  Admin/Staff
router.get(
    "/active",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const sessions = await Session.find({ status: "active" })
                .populate("user", "name email")
                .populate("station", "name type pricePerHour")
                .populate("game", "title")
                .populate("booking")
                .sort({ startTime: -1 });

            res.json(sessions);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// @route   GET /api/sessions/:id
// @desc    Get session by ID
// @access  Admin/Staff
router.get(
    "/:id",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const session = await Session.findById(req.params.id)
                .populate("user", "name email")
                .populate("station", "name type pricePerHour")
                .populate("game", "title")
                .populate("booking");

            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }

            res.json(session);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// @route   POST /api/sessions/start
// @desc    Start a new session (walk-in or from booking)
// @access  Admin/Staff
router.post(
    "/start",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const { bookingId, stationId, userId, gameId, duration, customerName } = req.body;

            if (!stationId) {
                return res.status(400).json({ message: "Station is required" });
            }

            // Check station is available
            const station = await Station.findById(stationId);
            if (!station) {
                return res.status(404).json({ message: "Station not found" });
            }
            if (station.status !== "Available") {
                return res.status(400).json({ message: "Station is not available" });
            }

            const session = await Session.create({
                booking: bookingId || null,
                station: stationId,
                user: userId || null,
                game: gameId || null,
                duration: duration || 60,
                customerName: customerName || "Walk-in Customer",
                startTime: new Date(),
                status: "active",
            });

            // Update station status
            await Station.findByIdAndUpdate(stationId, { status: "In Use" });

            // Update booking status if linked
            if (bookingId) {
                await Booking.findByIdAndUpdate(bookingId, { status: "active" });
            }

            const populatedSession = await Session.findById(session._id)
                .populate("user", "name email")
                .populate("station", "name type pricePerHour")
                .populate("game", "title");

            res.status(201).json(populatedSession);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// @route   POST /api/sessions/:id/end
// @desc    End a session and create a pending payment
// @access  Admin/Staff
router.post(
    "/:id/end",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const session = await Session.findById(req.params.id)
                .populate("station")
                .populate("game")
                .populate("user", "name email");

            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }

            session.endTime = new Date();
            session.status = "completed";

            // Calculate actual duration in minutes
            const actualMinutes = Math.ceil(
                (session.endTime - session.startTime) / 60000
            );
            const hours = actualMinutes / 60;

            // Calculate amount using station's price per hour
            const rate = session.station?.pricePerHour || 0;
            session.totalAmount = Math.ceil(rate * hours);

            await session.save();

            // Update station status back to Available
            if (session.station) {
                await Station.findByIdAndUpdate(session.station._id, {
                    status: "Available",
                });
            }

            // Update booking status if linked
            if (session.booking) {
                await Booking.findByIdAndUpdate(session.booking, {
                    status: "completed",
                });
            }

            // Auto-create a pending payment
            const gameName = session.game?.title || "General Gaming";
            const stationName = session.station?.name || "Unknown Station";
            const durationStr = actualMinutes >= 60
                ? `${Math.floor(actualMinutes / 60)}h ${actualMinutes % 60}m`
                : `${actualMinutes}m`;

            await Payment.create({
                session: session._id,
                booking: session.booking || null,
                user: session.user?._id || null,
                customerName: session.customerName || session.user?.name || "Walk-in",
                amount: session.totalAmount,
                method: "cash",
                status: "pending",
                description: `${gameName} — ${stationName} — ${durationStr}`,
                transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            });

            // Return the completed session with total
            const completedSession = await Session.findById(session._id)
                .populate("user", "name email")
                .populate("station", "name type pricePerHour")
                .populate("game", "title");

            res.json(completedSession);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// @route   POST /api/sessions/:id/extend
// @desc    Extend a session
// @access  Admin/Staff
router.post(
    "/:id/extend",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const { duration } = req.body; // additional minutes

            const session = await Session.findById(req.params.id);
            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }

            session.duration = (session.duration || 0) + (duration || 30);
            session.status = "extended";
            await session.save();

            res.json({ message: "Session extended", session });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

module.exports = router;
