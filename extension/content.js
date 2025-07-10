let startTime = Date.now();
let hostname = window.location.hostname;
console.log("Extension started on:", hostname);

window.addEventListener("beforeunload", () => {
  const duration = Date.now() - startTime;
  console.log("⏱️ Sending:", hostname, duration);
  chrome.runtime.sendMessage({ hostname, duration });
});
