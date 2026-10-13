# 🚀 AI-Powered E-Commerce Funnel & Automated Cart Recovery Engine

An intelligent, event-driven Node.js backend service designed to track user conversion funnels, detect abandoned shopping carts via background cron workers, and automatically generate hyper-personalized recovery emails using **Google Gemini AI**.

---

## 💡 The Business Problem It Solves
Standard e-commerce backends only perform basic CRUD operations. However, businesses lose ~70% of potential revenue due to **Cart Abandonment**. 
This backend solves that problem by:
1. Tracking real-time user funnel events (`viewed` ➔ `added_to_cart` ➔ `purchased`).
2. Running an asynchronous background worker that identifies dropped-off users without blocking the main API thread.
3. Utilizing **LLMs (Gemini 3.0 Flash)** to dynamically craft persuasive, context-aware discount emails based on the exact product and price left in the cart.

---

## 🛠️ Tech Stack & Architecture
* **Runtime & Framework:** Node.js, Express.js (MVC Architecture)
* **Database:** MongoDB & Mongoose ODM
* **Background Processing:** `node-cron` (Scheduled Asynchronous Workers)
* **AI Integration:** `@google/generative-ai` (Google Gemini SDK)

### Folder Structure
```text
ecommerce_funnel/
├── controllers/
│   └── cartEventController.js   # Event ingestion & MongoDB Aggregation analytics
├── models/
│   └── CartEvent.js             # Mongoose schema with strict enum validation & timestamps
├── routes/
│   └── cartEvent.routes.js      # RESTful API route definitions
├── side_jobs/
│   └── cartRecoveryjob.js       # Cron worker, Gemini AI prompt engine & state management
├── .env                         # Environment variables (kept private)
└── server.js                    # Express app entry point & DB connection
```

---

## ⚙️ Key Engineering Highlights (What Makes This Stand Out)

* **Idempotent State Management:** Prevents duplicate spam emails by transitioning processed cart states from `added_to_cart` to `email_sent` immediately after recovery trigger.
* **Fault-Tolerant AI Fallback Mechanism:** Handles external LLM API rate limits (`429 Too Many Requests`) and server spikes (`503 Service Unavailable`) gracefully by switching to a smart fallback template, ensuring zero downtime in the recovery pipeline.
* **Scalable Analytics with MongoDB Aggregation:** Instead of running multiple `countDocuments` queries or loading documents into memory, the `/api/funnel-stats` endpoint uses a single `$group` aggregation pipeline to compute real-time conversion metrics directly inside the database engine.

---

## 📡 API Endpoints

### 1. Track User Funnel Event
**`POST /api/track-event`**

Ingests user activity into the funnel.
* **Request Body:**
```json
{
  "userEmail": "customer@example.com",
  "productName": "Gaming Laptop",
  "price": 1200,
  "action": "added_to_cart"
}
```

### 2. Get Real-Time Funnel Analytics
**`GET /api/funnel-stats`**

Returns aggregated counts for every funnel stage dynamically using MongoDB `$group`.
* **Sample Response:**
```json
{
  "funnelStats": [
    { "_id": "viewed", "total": 15 },
    { "_id": "added_to_cart", "total": 4 },
    { "_id": "email_sent", "total": 8 },
    { "_id": "purchased", "total": 5 }
  ]
}
```

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone <your-github-repo-url>
   cd ecommerce_funnel
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/ecommerce_funnel
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. **Start the development server:**
   ```bash
   npm run dev
   ```