import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import axios from "axios";

const ShortenerPage = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl(null);

    try {
      const res = await axios.post("http://localhost:5000/shorturls", {
        longUrl,
      });
      setShortUrl(res.data.shortUrl);
      setExpiry(res.data.expiry);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          🔗 URL Shortener
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Enter Long URL"
            variant="outlined"
            fullWidth
            required
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2, bgcolor: "#1976d2" }}
          >
            Shorten URL
          </Button>
        </Box>

        {error && (
          <Typography color="error" mt={2}>
            {error}
          </Typography>
        )}

        {shortUrl && (
          <Box mt={4}>
            <Typography variant="h6">✅ Shortened URL:</Typography>
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
            {expiry && (
              <Typography variant="body2" mt={1}>
                ⏳ Expires on: {new Date(expiry).toLocaleString()}
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default ShortenerPage;
