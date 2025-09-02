// youtube.js
// Simple YouTube video sequencer without API keys
// Save as: app/youtube.js

// Example study-focused playlist (video IDs only)
const playlist = [
  'jNQXAC9IVRw', // Study music
  '5qap5aO4i9A', // Lofi hip hop radio
  'DWcJFNfaw9c', // Focus music
  'hHW1oY26kxQ', // Ambient study
  'dQw4w9WgXcQ', // Rickroll 😄 (break time!)
];

// Sequencer state
let currentIndex = 0;
let autoplay = false;
let onChangeCallback = null;

// Get current video ID
function getCurrentVideo() {
  return playlist[currentIndex];
}

// Move to next video
function nextVideo() {
  currentIndex = (currentIndex + 1) % playlist.length;
  if (onChangeCallback) onChangeCallback(getCurrentVideo());
  return getCurrentVideo();
}

// Move to previous video
function prevVideo() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  if (onChangeCallback) onChangeCallback(getCurrentVideo());
  return getCurrentVideo();
}

// Jump to specific index
function goToVideo(index) {
  if (index >= 0 && index < playlist.length) {
    currentIndex = index;
    if (onChangeCallback) onChangeCallback(getCurrentVideo());
  }
  return getCurrentVideo();
}

// Set autoplay on/off
function setAutoplay(state) {
  autoplay = Boolean(state);
}

// Bind a callback for video changes
function onVideoChange(callback) {
  onChangeCallback = callback;
}

// For autoplay sequencing
function handleVideoEnd() {
  if (autoplay) {
    nextVideo();
  }
}

// Get current index for UI
function getCurrentIndex() {
  return currentIndex;
}

// Export functions
module.exports = {
  playlist,
  getCurrentVideo,
  nextVideo,
  prevVideo,
  goToVideo,
  setAutoplay,
  onVideoChange,
  handleVideoEnd,
  getCurrentIndex,
  get autoplay() { return autoplay; }, // Getter for autoplay state
  get currentIndex() { return currentIndex; } // Getter for current index
};
