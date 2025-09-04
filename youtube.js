// youtube.js
// Lightweight, safe YouTube video sequencer
// Save as: app/youtube.js

let playlist = [];
let currentIndex = 0;
let autoplay = false;
let onChangeCallback = null;

// Add video to playlist
function addVideo(videoId) {
  if (typeof videoId === 'string' && videoId.trim() !== '') {
    playlist.push(videoId.trim());
    return true;
  }
  return false;
}

// Remove video by index
function removeVideo(index) {
  if (index >= 0 && index < playlist.length) {
    playlist.splice(index, 1);
    if (currentIndex >= playlist.length) currentIndex = 0;
    return true;
  }
  return false;
}

// Get current video ID safely
function getCurrentVideo() {
  if (playlist.length === 0) return null;
  return playlist[currentIndex];
}

// Move to next video
function nextVideo() {
  if (playlist.length === 0) return null;
  currentIndex = (currentIndex + 1) % playlist.length;
  if (onChangeCallback) onChangeCallback(getCurrentVideo());
  return getCurrentVideo();
}

// Move to previous video
function prevVideo() {
  if (playlist.length === 0) return null;
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  if (onChangeCallback) onChangeCallback(getCurrentVideo());
  return getCurrentVideo();
}

// Jump to specific index safely
function goToVideo(index) {
  if (index >= 0 && index < playlist.length) {
    currentIndex = index;
    if (onChangeCallback) onChangeCallback(getCurrentVideo());
    return true;
  }
  return false;
}

// Enable/disable autoplay
function setAutoplay(state) {
  autoplay = Boolean(state);
}

// Handle end of current video (autoplay flow)
function handleVideoEnd() {
  if (autoplay) return nextVideo();
  return null;
}

// Register a callback for video changes
function onVideoChange(callback) {
  if (typeof callback === 'function') {
    onChangeCallback = callback;
  }
}

// Reset playlist completely
function clearPlaylist() {
  playlist = [];
  currentIndex = 0;
}

// Export functions
module.exports = {
  addVideo,
  removeVideo,
  getCurrentVideo,
  nextVideo,
  prevVideo,
  goToVideo,
  setAutoplay,
  handleVideoEnd,
  onVideoChange,
  clearPlaylist
};
