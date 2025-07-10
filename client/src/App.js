import React, { useEffect, useState } from "react";
import "./popup.css";
import { Pie, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";

function App() {
  const [theme, setTheme] = useState("light");
  const [today, setToday] = useState([]);
  const [weekly, setWeekly] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/today")
      .then((res) => res.json())
      .then(setToday)
      .catch((err) => console.error("Today fetch error:", err));

    fetch("http://localhost:5000/api/weekly")
      .then((res) => res.json())
      .then(setWeekly)
      .catch((err) => console.error("Weekly fetch error:", err));
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const formatTime = (ms) => {
  let totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);

  return parts.join(" ");
};



  // Group time by hostname (removing www. and excluding localhost)
  const groupBySite = (data) => {
    const grouped = {};
    data.forEach((item) => {
      let host = item.hostname.replace(/^www\./, "");
      if (host === "localhost") return; // exclude localhost
      grouped[host] = (grouped[host] || 0) + item.timeSpent;
    });
    return grouped;
  };

  const todaySites = groupBySite(today);
  const weeklySites = groupBySite(weekly);

  const pieData = {
    labels: Object.keys(todaySites),
    datasets: [
      {
        label: "Today",
        data: Object.values(todaySites).map((ms) => Math.floor(ms / 1000)),
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56", "#4CAF50", "#9C27B0"],
      },
    ],
  };

  const barData = {
    labels: Object.keys(weeklySites),
    datasets: [
      {
        label: "Weekly",
        backgroundColor: "#36A2EB",
        data: Object.values(weeklySites).map((ms) => Math.floor(ms / 1000)),
      },
      {
        label: "Today",
        backgroundColor: "#FF6384",
        data: Object.keys(weeklySites).map((site) =>
          Math.floor((todaySites[site] || 0) / 1000)
        ),
      },
    ],
  };

  return (
    <div className={`popup ${theme}`}>
      <h2>📊 Productivity Tracker</h2>
      <button onClick={toggleTheme}>
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>

      <h3>🧁 Pie Chart (Today)</h3>
      <Pie data={pieData} />

      <h3>📊 Bar Chart (Today vs Weekly)</h3>
      <Bar data={barData} />

      <div className="text-report">
        {Object.keys(todaySites).map((site, idx) => (
          <div key={idx}>
            <strong>{site}</strong>: {formatTime(todaySites[site])} today
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
