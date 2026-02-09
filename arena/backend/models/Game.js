const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  title: String,
  genre: String,
  pricePerHour: Number,
  platform: String
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
