const express = require("express");
const router = express.Router();
const Game = require("../models/Game");
const { protect, authorize } = require("../middleware/auth");

// @route   GET /api/games
// @desc    Get all games
// @access  Public
router.get("/", async (req, res) => {
    try {
        const games = await Game.find().sort({ title: 1 });
        res.json(games);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/games/:id
// @desc    Get game by ID
// @access  Public
router.get("/:id", async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   POST /api/games
// @desc    Create a game
// @access  Admin only
router.post("/", protect, authorize("admin"), async (req, res) => {
    try {
        const game = await Game.create(req.body);
        res.status(201).json(game);
    } catch (error) {
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map((e) => e.message);
            return res.status(400).json({ message: messages.join(", ") });
        }
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   PUT /api/games/:id
// @desc    Update a game
// @access  Admin only
router.put("/:id", protect, authorize("admin"), async (req, res) => {
    try {
        const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.json(game);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   DELETE /api/games/:id
// @desc    Delete a game
// @access  Admin only
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
    try {
        const game = await Game.findByIdAndDelete(req.params.id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.json({ message: "Game deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
