chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.hostname && message.duration) {
    fetch("http://localhost:5000/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    })
    .then(res => res.json())
    .then(data => console.log("Tracked:", data))
    .catch(err => console.error("Tracking failed:", err));
  }
});
