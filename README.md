# 🔗 MERN URL Shortener

A full-stack URL shortener built using **MongoDB, Express.js, React, Node.js**, and **Material UI**, with features like:

- Custom & auto-generated short URLs
- Expiry support
- Click statistics & referrer logging
- Authentication (with token)
- Microservice-based architecture

---

## 🚀 Tech Stack

- 🧠 Backend: Node.js, Express, MongoDB, Mongoose
- 🎨 Frontend: React.js, Material UI
- 🔒 Auth: Token-based (client ID/secret)
- 🧩 Middleware: Logger, Auth handler
- 🛠️ Tools: Postman for API testing

---

## 📦 API Endpoints

### ✅ `POST /shorturls`

**Create a short URL**

```json
Request Body:
{
  "longUrl": "https://example.com",
  "customCode": "abc123", // optional
  "validityInDays": 7 // optional (default 30)
}
```

### Returns

```json
{
  "shortUrl": "http://localhost:5000/abc123"
}
```

### 📈 GET /shorturls/:urlCode

**Description:** Get statistics for a short URL

**Returns:**

```json
{
  "longUrl": "[https://example.com](https://example.com)",
  "shortUrl": "http://localhost:5000/abc123",
  "expiry": "2025-08-15T00:00:00Z",
  "totalClicks": 5,
  "clickDetails": [
    {
      "timestamp": "2025-07-14T12:00:00Z",
      "ip": "127.0.0.1",
      "referrer": "direct"
    }
  ]
}
```


## 📺 Demo And Pictures 

▶️ Watch the full demo video: 



https://github.com/user-attachments/assets/e097b9f9-9b6d-4ed0-a43f-0895eb2b0e6a



<img width="1886" height="1011" alt="Screenshot 2025-07-14 112835" src="https://github.com/user-attachments/assets/d95efd34-6ab8-464a-8b57-45adea413e94" />

---


