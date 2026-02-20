const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Session = require("../models/Session");
const { protect, authorize } = require("../middleware/auth");

// All report routes require admin
router.use(protect);
router.use(authorize("admin"));

// @route   GET /api/reports/daily
// @desc    Get daily report
router.get("/daily", async (req, res) => {
    try {
        const { date } = req.query;
        const reportDate = date ? new Date(date) : new Date();
        const startOfDay = new Date(reportDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(reportDate);
        endOfDay.setHours(23, 59, 59, 999);

        const filter = { createdAt: { $gte: startOfDay, $lte: endOfDay } };

        const [bookings, payments, sessions] = await Promise.all([
            Booking.find(filter)
                .populate("user", "name")
                .populate("game", "title")
                .populate("station", "name"),
            Payment.find({ ...filter, status: "completed" }),
            Session.find(filter),
        ]);

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        res.json({
            date: reportDate.toISOString().split("T")[0],
            totalBookings: bookings.length,
            totalSessions: sessions.length,
            totalRevenue,
            totalPayments: payments.length,
            bookings,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/reports/monthly
// @desc    Get monthly report
router.get("/monthly", async (req, res) => {
    try {
        const { month, year } = req.query;
        const m = parseInt(month) || new Date().getMonth() + 1;
        const y = parseInt(year) || new Date().getFullYear();

        const startOfMonth = new Date(y, m - 1, 1);
        const endOfMonth = new Date(y, m, 0, 23, 59, 59, 999);

        const filter = { createdAt: { $gte: startOfMonth, $lte: endOfMonth } };

        const [bookings, payments, sessions] = await Promise.all([
            Booking.countDocuments(filter),
            Payment.find({ ...filter, status: "completed" }),
            Session.countDocuments(filter),
        ]);

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        res.json({
            month: m,
            year: y,
            totalBookings: bookings,
            totalSessions: sessions,
            totalRevenue,
            totalPayments: payments.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/reports/custom
// @desc    Get custom date range report
router.get("/custom", async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res
                .status(400)
                .json({ message: "Start date and end date are required" });
        }

        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const filter = { createdAt: { $gte: start, $lte: end } };

        const [bookings, payments, sessions] = await Promise.all([
            Booking.countDocuments(filter),
            Payment.find({ ...filter, status: "completed" }),
            Session.countDocuments(filter),
        ]);

        const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

        res.json({
            startDate,
            endDate,
            totalBookings: bookings,
            totalSessions: sessions,
            totalRevenue,
            totalPayments: payments.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/reports/export/:type
// @desc    Export report as JSON (placeholder for CSV/PDF)
router.get("/export/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const { startDate, endDate } = req.query;

        const start = startDate
            ? new Date(startDate)
            : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();

        const filter = { createdAt: { $gte: start, $lte: end } };

        let data;

        switch (type) {
            case "bookings":
                data = await Booking.find(filter)
                    .populate("user", "name email")
                    .populate("game", "title")
                    .populate("station", "name");
                break;
            case "payments":
                data = await Payment.find(filter)
                    .populate("user", "name email")
                    .populate("booking");
                break;
            case "sessions":
                data = await Session.find(filter)
                    .populate("user", "name email")
                    .populate("station", "name")
                    .populate("game", "title");
                break;
            default:
                return res.status(400).json({ message: "Invalid export type" });
        }

        // Return as JSON (client can convert as needed)
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
