const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const Station = require("../models/Station");
const Booking = require("../models/Booking");
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
                .populate("station", "name type")
                .populate("game", "title pricePerHour")
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
                .populate("station", "name type")
                .populate("game", "title pricePerHour")
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
// @desc    Start a new session
// @access  Admin/Staff
router.post(
    "/start",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const { bookingId, stationId, userId, gameId, duration } = req.body;

            const session = await Session.create({
                booking: bookingId || null,
                station: stationId,
                user: userId || req.user._id,
                game: gameId || null,
                duration: duration || 60,
                startTime: new Date(),
                status: "active",
            });

            // Update station status
            if (stationId) {
                await Station.findByIdAndUpdate(stationId, { status: "In Use" });
            }

            // Update booking status if linked
            if (bookingId) {
                await Booking.findByIdAndUpdate(bookingId, { status: "active" });
            }

            const populatedSession = await Session.findById(session._id)
                .populate("user", "name email")
                .populate("station", "name type")
                .populate("game", "title pricePerHour");

            res.status(201).json(populatedSession);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// @route   POST /api/sessions/:id/end
// @desc    End a session
// @access  Admin/Staff
router.post(
    "/:id/end",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const session = await Session.findById(req.params.id)
                .populate("station")
                .populate("game");

            if (!session) {
                return res.status(404).json({ message: "Session not found" });
            }

            session.endTime = new Date();
            session.status = "completed";

            // Calculate actual duration in minutes
            const actualMinutes = Math.ceil(
                (session.endTime - session.startTime) / 60000
            );

            // Calculate amount based on actual time
            if (session.game) {
                const hours = actualMinutes / 60;
                session.totalAmount = Math.ceil(session.game.pricePerHour * hours);
            }

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

            res.json(session);
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
