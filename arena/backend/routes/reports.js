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

// Helper: escape CSV field values
const escapeCSV = (val) => {
    if (val === null || val === undefined) return "";
    const str = String(val);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
};

// @route   GET /api/reports/export/:type
// @desc    Export report as CSV file download
router.get("/export/:type", async (req, res) => {
    try {
        const { type } = req.params;
        const { startDate, endDate } = req.query;

        const start = startDate
            ? new Date(startDate)
            : new Date(new Date().setDate(new Date().getDate() - 30));
        const end = endDate ? new Date(endDate) : new Date();
        end.setHours(23, 59, 59, 999);

        const filter = { createdAt: { $gte: start, $lte: end } };

        let csvContent = "";

        switch (type) {
            case "bookings": {
                const data = await Booking.find(filter)
                    .populate("user", "name email phone")
                    .populate("game", "title")
                    .populate("station", "name")
                    .sort({ createdAt: -1 });

                csvContent = "Sr.No,Customer,Email,Phone,Game,Station,Date,Time,Duration (hrs),Price (₹),Status,Created At\n";
                data.forEach((b, i) => {
                    csvContent += [
                        i + 1,
                        escapeCSV(b.user?.name || "N/A"),
                        escapeCSV(b.user?.email || ""),
                        escapeCSV(b.user?.phone || ""),
                        escapeCSV(b.game?.title || "N/A"),
                        escapeCSV(b.station?.name || "N/A"),
                        escapeCSV(b.bookingDate || ""),
                        escapeCSV(b.bookingTime || ""),
                        b.duration || 0,
                        b.totalPrice || 0,
                        escapeCSV(b.status || ""),
                        escapeCSV(new Date(b.createdAt).toLocaleString("en-IN")),
                    ].join(",") + "\n";
                });
                break;
            }

            case "payments": {
                const data = await Payment.find(filter)
                    .populate("user", "name email")
                    .populate({
                        path: "booking",
                        populate: [
                            { path: "game", select: "title" },
                            { path: "station", select: "name" },
                        ],
                    })
                    .sort({ createdAt: -1 });

                csvContent = "Sr.No,Customer,Description,Amount (₹),Paid (₹),Remaining (₹),Method,Status,Transaction ID,Created At\n";
                data.forEach((p, i) => {
                    const paidAmount = p.paidAmount || (p.status === "completed" ? p.amount : 0);
                    const remaining = Math.max(p.amount - paidAmount, 0);
                    csvContent += [
                        i + 1,
                        escapeCSV(p.customerName || p.user?.name || "Walk-in"),
                        escapeCSV(p.description || "-"),
                        p.amount || 0,
                        paidAmount,
                        remaining,
                        escapeCSV(p.method || "cash"),
                        escapeCSV(p.status || ""),
                        escapeCSV(p.transactionId || ""),
                        escapeCSV(new Date(p.createdAt).toLocaleString("en-IN")),
                    ].join(",") + "\n";
                });
                break;
            }

            case "sessions": {
                const data = await Session.find(filter)
                    .populate("user", "name email")
                    .populate("station", "name")
                    .populate("game", "title")
                    .sort({ createdAt: -1 });

                csvContent = "Sr.No,Customer,Game,Station,Start Time,End Time,Duration,Status,Created At\n";
                data.forEach((s, i) => {
                    csvContent += [
                        i + 1,
                        escapeCSV(s.user?.name || "N/A"),
                        escapeCSV(s.game?.title || "N/A"),
                        escapeCSV(s.station?.name || "N/A"),
                        escapeCSV(s.startTime ? new Date(s.startTime).toLocaleString("en-IN") : ""),
                        escapeCSV(s.endTime ? new Date(s.endTime).toLocaleString("en-IN") : ""),
                        s.duration || 0,
                        escapeCSV(s.status || ""),
                        escapeCSV(new Date(s.createdAt).toLocaleString("en-IN")),
                    ].join(",") + "\n";
                });
                break;
            }

            default:
                return res.status(400).json({ message: "Invalid export type" });
        }

        const dateStr = new Date().toISOString().split("T")[0];
        const filename = `${type}_export_${dateStr}.csv`;

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.send(csvContent);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
