import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import axios from "axios";

const StatsPage = () => {
  const [code, setCode] = useState("");
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const handleFetchStats = async () => {
    setError("");
    setStats(null);

    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${code}`);
      console.log("📦 API Response:", res.data);
      setStats(res.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          📊 URL Statistics
        </Typography>

        <Box display="flex" gap={2} mt={3}>
          <TextField
            label="Enter Shortcode (e.g. abcd12)"
            variant="outlined"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleFetchStats}
            sx={{ whiteSpace: "nowrap" }}
          >
            Fetch Stats
          </Button>
        </Box>

        {error && (
          <Typography color="error" mt={2}>
            ❌ {error}
          </Typography>
        )}

        {stats && (
          <Box mt={4}>
            <Divider />
            <Typography variant="h6" mt={2}>🔗 Long URL:</Typography>
            <Typography color="text.secondary">{stats.longUrl || "Not available"}</Typography>

            <Typography variant="h6" mt={2}>📎 Short URL:</Typography>
            <Typography color="text.secondary">
              {stats.shortUrl ? (
                <a href={stats.shortUrl} target="_blank" rel="noopener noreferrer">
                  {stats.shortUrl}
                </a>
              ) : "Not available"}
            </Typography>

            <Typography variant="h6" mt={2}>⏳ Expiry:</Typography>
            <Typography color="text.secondary">
              {stats.expiry
                ? new Date(stats.expiry).toLocaleString()
                : "Not set"}
            </Typography>

            <Typography variant="h6" mt={2}>📈 Total Clicks:</Typography>
            <Typography color="text.secondary">{stats.totalClicks ?? stats.clicks ?? 0}</Typography>

            {Array.isArray(stats.clickDetails) && stats.clickDetails.length > 0 ? (
              <>
                <Typography variant="h6" mt={2}>👁️ Click Details:</Typography>
                <List>
                  {stats.clickDetails.map((click, i) => (
                    <ListItem key={i} divider>
                      <ListItemText
                        primary={`🕒 Time: ${new Date(click.timestamp).toLocaleString()}`}
                        secondary={`IP: ${click.ip} | Referrer: ${click.referrer}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            ) : (
              <Typography color="text.secondary" mt={2}>
                No detailed click data available.
              </Typography>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default StatsPage;
