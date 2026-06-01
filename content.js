// This runs inside the YouTube page
// For now, just prove it's working
console.log("Better Video Speed Controller loaded");

const DEFAULT_PLAYBACK_RATE = 2.0;

const setVideoSpeed = (rate) => {
  const videoEl = document.getElementsByTagName("video");
  if (videoEl.length > 0) {
    // Increate playback speed to 2x
    const currentPlaybackRate = videoEl[0].playbackRate;

    if (currentPlaybackRate < rate) {
      videoEl[0].playbackRate = rate;
      console.log(`Speed set to ${rate}x`);
      return true;
    }
  }
  return false;
};

if (!setVideoSpeed(2.0)) {
  console.warn("No video yet — watching for it...");

  const observer = new MutationObserver(() => {
    if (setVideoSpeed(2.0)) {
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true, // watch for elements being added/removed
    subtree: true, // watch all descendants, not just direct children
  });
}
