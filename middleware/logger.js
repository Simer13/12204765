const axios = require("axios");

let authToken = "";

function setAuthToken(token) {
  authToken = token;
}

async function log(stack, level, pkg, message) {
  try {
    await axios.post("http://20.244.56.144/evaluation-service/logs", {
      stack,
      level,
      package: pkg,
      message,
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (err) {
    console.error("Logging error:", err.response?.data || err.message);
  }
}

module.exports = { log, setAuthToken };
