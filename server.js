require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cartEventRoutes = require("./routes/cartEvent.routes");

const app = express();
app.use(express.json());
//URL ROUTES .
app.use("/api", cartEventRoutes);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected `);
  } catch (error) {
    console.error(`MongoDB Connection Failed: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

app.get("/", (req, res) => {
  res.send("hello from backend");
});

require("./side_jobs/cartRecoveryjob");

const port = process.env.port || 3000;
app.listen(port, () => {
  console.log(`server is perfectly running on ${port}`);
});
