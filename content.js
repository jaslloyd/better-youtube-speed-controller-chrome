// This runs inside the YouTube page
console.log("Better Video Speed Controller loaded");

const DEFAULT_PLAYBACK_RATE = 2.0;

const setVideoSpeed = (rate) => {
  const videoEl = document.getElementsByTagName("video");
  if (videoEl.length > 0) {
    videoEl[0].playbackRate = rate;
    console.log(`Speed set to ${rate}x`);
    return true;
  }
  return false;
};

const setNewRateFromOverlay = (step) => {
  const newRate = document.querySelector("video").playbackRate + step;
  document.getElementById("bvsc-currentRate").textContent = `${newRate}x`;
  setVideoSpeed(newRate);
  chrome.storage.sync.set({ playbackRate: newRate });
};

const injectOverlay = (rate) => {
  const overlayElement = document.createElement("div");
  overlayElement.id = "bvsc-overlay";
  overlayElement.innerHTML = `
    <button id='bvsc-slower'>-</button>
    <p id='bvsc-currentRate'>${rate}x</p>
    <button id='bvsc-faster'>+</button>
  `;

  if (!document.getElementById("bvsc-styles")) {
    const style = document.createElement("link");
    style.id = "bvsc-styles";
    style.rel = "stylesheet";
    style.href = chrome.runtime.getURL("overlay.css");
    document.head.appendChild(style);
  }

  const videoEl = document.querySelector("video");
  const container =
    videoEl.closest(".html5-video-container") ?? videoEl.parentElement;

  container.style.position = "relative";
  container.appendChild(overlayElement);

  document.getElementById("bvsc-slower").addEventListener("click", (e) => {
    e.stopPropagation();
    setNewRateFromOverlay(-0.25);
  });

  document.getElementById("bvsc-faster").addEventListener("click", (e) => {
    e.stopPropagation();
    setNewRateFromOverlay(0.25);
  });

  // Need this as youtube will go fullscreen if you click really fast
  document.getElementById("bvsc-slower").addEventListener("dblclick", (e) => {
    e.stopPropagation();
  });

  document.getElementById("bvsc-faster").addEventListener("dblclick", (e) => {
    e.stopPropagation();
  });
};

const main = () => {
  chrome.storage.sync.get("playbackRate", (result) => {
    const rate = result.playbackRate ?? DEFAULT_PLAYBACK_RATE;
    if (!setVideoSpeed(rate)) {
      console.warn("No video yet — watching for it...");

      const observer = new MutationObserver(() => {
        if (setVideoSpeed(rate)) {
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true, // watch for elements being added/removed
        subtree: true, // watch all descendants, not just direct children
      });
    }
    if (!document.getElementById("bvsc-overlay")) {
      injectOverlay(rate);
    }
  });
};

main();

document.addEventListener("yt-navigate-finish", main);

// Handles chaning the speed by the user
chrome.runtime.onMessage.addListener((message) => {
  const { type, rate } = message;
  if (type === "SET_SPEED") {
    console.log(`Changing speed of videos to ${rate}`);
    setVideoSpeed(rate);
  }
});
