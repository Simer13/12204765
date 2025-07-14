const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  longUrl: String,
  shortUrl: String,
  urlCode: { type: String, unique: true },
  expiration: Date,
  clicks: [
    {
      timestamp: Date,
      referrer: String,
      ip: String,
    },
  ],
});

module.exports = mongoose.model("Url", UrlSchema);
