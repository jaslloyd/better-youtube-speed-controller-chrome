// Popup logic will go here
console.log("Popup opened");

const DEFAULT_PLAYBACK_RATE = 2.0;

const setDefaultVideoSpeed = (e) => {
  const rate = e.target.value;
  chrome.storage.sync.set({ playbackRate: rate });
  chrome.runtime.sendMessage(
    {
      type: "SET_SPEED",
      rate: parseFloat(rate),
    },
    (response) => {
      if (chrome.runtime.lastError) {
        // No content script on this tab, ignore
        console.warn(chrome.runtime.lastError.message);
      }
    },
  );
};

chrome.storage.sync.get("playbackRate", (result) => {
  const rate = result.playbackRate ?? DEFAULT_PLAYBACK_RATE;
  document.getElementById("rateInput").value = rate;
});

// Listen for input event, get the speed (use data-rate) call the sync API
document
  .getElementById("rateInput")
  .addEventListener("input", setDefaultVideoSpeed);
