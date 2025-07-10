const express = require("express");
const router = express.Router();
const UserData = require("../models/UserData");

// Save site usage data
router.post("/save", async (req, res) => {
  const { hostname, timeSpent } = req.body;
  await UserData.create({ hostname, timeSpent });
  res.send("Data saved");
});

// Get full report (all time)
router.get("/report", async (req, res) => {
  const data = await UserData.find();
  res.json(data);
});

// Get today's stats
router.get("/today", async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const todayData = await UserData.find({
    createdAt: { $gte: start, $lte: end },
  });

  res.json(todayData);
});

// Get weekly stats
router.get("/weekly", async (req, res) => {
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const weekData = await UserData.find({
    createdAt: { $gte: lastWeek },
  });

  res.json(weekData);
});

module.exports = router;
