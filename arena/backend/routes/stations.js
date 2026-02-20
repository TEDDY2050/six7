const express = require("express");
const router = express.Router();
const Station = require("../models/Station");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/stations
// @desc    Get all stations
// @access  Public
router.get("/", async (req, res) => {
    try {
        const stations = await Station.find().sort({ name: 1 });
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/stations/available
// @desc    Get available stations
// @access  Public
router.get("/available", async (req, res) => {
    try {
        const { type } = req.query;
        const filter = { status: "Available" };
        if (type) filter.type = type;

        const stations = await Station.find(filter).sort({ name: 1 });
        res.json(stations);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/stations/:id
// @desc    Get station by ID
// @access  Private
router.get("/:id", protect, async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   POST /api/stations
// @desc    Create a station
// @access  Admin only
router.post("/", protect, authorize("admin"), async (req, res) => {
    try {
        const station = await Station.create(req.body);
        res.status(201).json(station);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   PUT /api/stations/:id
// @desc    Update a station
// @access  Admin only
router.put("/:id", protect, authorize("admin"), async (req, res) => {
    try {
        const station = await Station.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }
        res.json(station);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   PATCH /api/stations/:id/status
// @desc    Update station status
// @access  Admin/Staff
router.patch(
    "/:id/status",
    protect,
    authorize("admin", "staff"),
    async (req, res) => {
        try {
            const { status } = req.body;
            const station = await Station.findByIdAndUpdate(
                req.params.id,
                { status },
                { new: true, runValidators: true }
            );
            if (!station) {
                return res.status(404).json({ message: "Station not found" });
            }
            res.json(station);
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// @route   DELETE /api/stations/:id
// @desc    Delete a station
// @access  Admin only
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
    try {
        const station = await Station.findByIdAndDelete(req.params.id);
        if (!station) {
            return res.status(404).json({ message: "Station not found" });
        }
        res.json({ message: "Station deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
