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
