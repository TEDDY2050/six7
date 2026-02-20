const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking");
const Station = require("../models/Station");
const Session = require("../models/Session");
const Payment = require("../models/Payment");
const Game = require("../models/Game");
const { protect, authorize } = require("../middleware/auth");

// All dashboard routes require admin or staff
router.use(protect);
router.use(authorize("admin", "staff"));

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
router.get("/stats", async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [totalUsers, totalBookings, activeStations, todayPayments] =
            await Promise.all([
                User.countDocuments(),
                Booking.countDocuments(),
                Station.countDocuments({ status: "In Use" }),
                Payment.find({
                    createdAt: { $gte: today },
                    status: "completed",
                }),
            ]);

        const todayRevenue = todayPayments.reduce((sum, p) => sum + p.amount, 0);
        const totalStations = await Station.countDocuments();

        res.json({
            totalUsers,
            totalBookings,
            activeStations,
            totalStations,
            todayRevenue,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/dashboard/revenue
// @desc    Get revenue data
router.get("/revenue", async (req, res) => {
    try {
        const { period } = req.query;
        const days = period === "monthly" ? 30 : 7;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const payments = await Payment.find({
            createdAt: { $gte: startDate },
            status: "completed",
        }).sort({ createdAt: 1 });

        // Group by day
        const revenueByDay = {};
        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        payments.forEach((payment) => {
            const date = payment.createdAt.toISOString().split("T")[0];
            const dayName = dayNames[payment.createdAt.getDay()];
            const key = period === "monthly" ? date : dayName;

            if (!revenueByDay[key]) {
                revenueByDay[key] = 0;
            }
            revenueByDay[key] += payment.amount;
        });

        const data = Object.entries(revenueByDay).map(([name, revenue]) => ({
            name,
            revenue,
        }));

        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/dashboard/popular-games
// @desc    Get popular games by booking count
router.get("/popular-games", async (req, res) => {
    try {
        const popularGames = await Booking.aggregate([
            { $group: { _id: "$game", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "games",
                    localField: "_id",
                    foreignField: "_id",
                    as: "gameInfo",
                },
            },
            { $unwind: "$gameInfo" },
            {
                $project: {
                    name: "$gameInfo.title",
                    bookings: "$count",
                },
            },
        ]);

        res.json(popularGames);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/dashboard/station-usage
// @desc    Get station usage statistics
router.get("/station-usage", async (req, res) => {
    try {
        const usage = await Station.aggregate([
            {
                $group: {
                    _id: "$type",
                    total: { $sum: 1 },
                    inUse: {
                        $sum: { $cond: [{ $eq: ["$status", "In Use"] }, 1, 0] },
                    },
                },
            },
        ]);

        res.json(usage);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/dashboard/activities
// @desc    Get recent activities
router.get("/activities", async (req, res) => {
    try {
        const recentBookings = await Booking.find()
            .populate("user", "name")
            .populate("station", "name")
            .populate("game", "title")
            .sort({ updatedAt: -1 })
            .limit(10);

        const activities = recentBookings.map((b) => ({
            user: b.user?.name || "Unknown",
            action:
                b.status === "active"
                    ? "Started session"
                    : b.status === "completed"
                        ? "Completed session"
                        : b.status === "cancelled"
                            ? "Cancelled booking"
                            : "New booking",
            station: b.station?.name || "",
            game: b.game?.title || "",
            time: b.updatedAt,
        }));

        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
