const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema({
  urlCode: String,
  clicks: Number
});

module.exports = mongoose.model("Stats", StatsSchema);
