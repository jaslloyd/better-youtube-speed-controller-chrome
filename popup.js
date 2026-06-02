console.log("Popup opened");

const DEFAULT_PLAYBACK_RATE = 2.0;

const saveRate = (rate) => {
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

const updateDisplay = (rate) => {
  document.getElementById("rateInput").value = rate;
  document.getElementById("display").innerHTML = `${rate}<span>x</span>`;
};

const setDefaultVideoSpeed = (e) => {
  const rate = e.target.value;
  saveRate(rate);
  updateDisplay(rate);
};

chrome.storage.sync.get("playbackRate", (result) => {
  const rate = result.playbackRate ?? DEFAULT_PLAYBACK_RATE;
  updateDisplay(rate);
});

const setNewRate = (step) => {
  // Avoid floating numbers
  const newRate =
    Math.round(
      (parseFloat(document.getElementById("rateInput").value) + step) * 100,
    ) / 100;
  updateDisplay(newRate);
  saveRate(newRate);
};

// Listen for input event, get the speed (use data-rate) call the sync API
document
  .getElementById("rateInput")
  .addEventListener("input", setDefaultVideoSpeed);

document.getElementById("slower").addEventListener("click", () => {
  setNewRate(-0.25);
});

document.getElementById("faster").addEventListener("click", () => {
  setNewRate(0.25);
});
