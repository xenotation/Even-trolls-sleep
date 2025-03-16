// Helper: Convert a Telegram date string "26.04.2023 18:09:34 UTC+02:00" into an ISO date string.
function parseTelegramDate(dateStr) {
    dateStr = dateStr.replace("UTC", "").trim();
    const parts = dateStr.split(" ");
    if (parts.length < 3) return new Date(dateStr);
    const dateParts = parts[0].split(".");
    const isoDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    return new Date(`${isoDate}T${parts[1]}${parts[2]}`);
  }
  
  // Auto-scroll so that the newest message (which becomes the leftmost after rotation) remains visible.
  function scrollToLatest() {
    var container = document.getElementById("rotate-container");
    container.scrollLeft = 0; // Always show leftmost part (newest message)
  }
  
  document.addEventListener("DOMContentLoaded", function () {
    const messages = Array.from(document.querySelectorAll(".message"));
  
    // Hide messages initially and set fade-in transition
    messages.forEach((msg) => {
      msg.style.opacity = 0;
      msg.style.transition = "opacity 0.5s ease-in";
    });
  
    // Find the first message with a date element as baseline
    const firstMsg = messages.find((msg) => {
      const dateEl = msg.querySelector(".date.details");
      return dateEl && dateEl.getAttribute("title");
    });
  
    if (!firstMsg) {
      messages.forEach((msg) => {
        msg.style.opacity = 1;
      });
      return;
    }
  
    const firstTime = parseTelegramDate(firstMsg.querySelector(".date.details").getAttribute("title")).getTime();
    const scale = 0.1; // Adjust scale factor if needed
  
    messages.forEach((msg) => {
      const dateEl = msg.querySelector(".date.details");
      if (!dateEl) {
        // For messages without a date (e.g. service messages), show them immediately.
        msg.style.opacity = 1;
        return;
      }
      const msgTime = parseTelegramDate(dateEl.getAttribute("title")).getTime();
      let delay = (msgTime - firstTime) * scale;
      delay = Math.max(0, delay);
      setTimeout(() => {
        msg.style.opacity = 1;
        scrollToLatest();
      }, delay);
    });
  });
  