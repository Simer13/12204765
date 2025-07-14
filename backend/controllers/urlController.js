exports.getShortUrlStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const url = await Url.findOne({ shortCode: shortcode });

    if (!url) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiry: url.expiry,
      totalClicks: url.clicks.length,
      clicks: url.clicks, 
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};
