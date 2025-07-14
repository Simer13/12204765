const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const shortid = require("shortid");
const axios = require("axios");
const Url = require("./models/url");
const Stats = require("./models/Stats");
const { log, setAuthToken } = require("../middleware/logger");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo Error", err));

(async () => {
  try {
    const res = await axios.post("http://20.244.56.144/evaluation-service/auth", {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLL,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    });
    setAuthToken(res.data.access_token);
    console.log("Authentication successful");
  } catch (err) {
    console.error("Auth failed:", err.response?.data || err.message);
  }
})();

app.post("/shorturls", async (req, res) => {
  const { longUrl, customCode, validityInDays = 30 } = req.body;
  try {
    const urlCode = customCode || shortid.generate();
    const existing = await Url.findOne({ urlCode });
    if (existing) {
      await log("backend", "error", "shorturl", "Custom code already exists");
      return res.status(409).json({ error: "Custom code already exists" });
    }

    const shortUrl = `${req.protocol}://${req.get("host")}/${urlCode}`;
    const expiration = new Date(Date.now() + validityInDays * 86400000);

    const newUrl = new Url({ longUrl, shortUrl, urlCode, expiration });
    await newUrl.save();
    await Stats.create({ urlCode, clicks: 0 });

    await log("backend", "info", "shorturl", `Created: ${shortUrl}`);
    res.status(201).json({ shortUrl });
  } catch (err) {
    await log("backend", "fatal", "shorturl", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/:urlCode", async (req, res) => {
  try {
    const url = await Url.findOne({ urlCode: req.params.urlCode });

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (new Date() > url.expiration) {
      return res.status(410).json({ error: "URL expired" });
    }

    url.clicks.push({
      timestamp: new Date(),
      referrer: req.get("Referrer") || "direct",
      ip: req.ip,
    });

    await url.save(); 

    res.redirect(url.longUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/shorturls/:code", async (req, res) => {
  try {
    const [url, stat] = await Promise.all([
      Url.findOne({ urlCode: req.params.code }),
      Stats.findOne({ urlCode: req.params.code }),
    ]);

    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (!stat) {
      return res.status(404).json({ error: "No stats found" });
    }

    return res.json({
      longUrl: url.longUrl,
      shortUrl: url.shortUrl,
      expiry: url.expiration,
      urlCode: url.urlCode,
      totalClicks: stat.clicks || 0,
      
    });
  } catch (err) {
    await log("backend", "error", "stats", err.message);
    return res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running at http://localhost:${PORT}`));
