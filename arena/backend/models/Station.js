const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  name: String,
  type: String,
  status: {
    type: String,
    default: "Available"
  }
});

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
