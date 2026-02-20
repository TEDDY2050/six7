const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Station name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Station type is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Available", "In Use", "Offline"],
        message: "{VALUE} is not a valid status",
      },
      default: "Available",
    },
  },
  { timestamps: true }
);

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;
