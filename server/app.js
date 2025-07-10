const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const UserData = require("./models/UserData");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { dbName: "tracker" })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.post("/api/track", async (req, res) => {
  const { hostname, duration } = req.body;
  try {
    const data = new UserData({ hostname, timeSpent: duration });
    await data.save();
    res.json({ message: "Saved", data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/today", async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const data = await UserData.find({ createdAt: { $gte: startOfDay } });
  res.json(data);
});

app.get("/api/weekly", async (req, res) => {
  const last7 = new Date();
  last7.setDate(last7.getDate() - 7);
  const data = await UserData.find({ createdAt: { $gte: last7 } });
  res.json(data);
});

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);
