const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  hostname: String,
  timeSpent: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserData", dataSchema);
