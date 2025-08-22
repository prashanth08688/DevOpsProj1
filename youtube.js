// youtube.js
// Simple YouTube video sequencer without API keys
// Save as: app/youtube.js

// Example playlist (video IDs only)
const playlist = [
    'dQw4w9WgXcQ', // Rickroll 😄
    'kxopViU98Xo', // Meme
    '3JZ_D3ELwOQ', // Music example
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
  }
  
  // Move to previous video
  function prevVideo() {
    currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    if (onChangeCallback) onChangeCallback(getCurrentVideo());
  }
  
  // Jump to specific index
  function goToVideo(index) {
    if (index >= 0 && index < playlist.length) {
      currentIndex = index;
      if (onChangeCallback) onChangeCallback(getCurrentVideo());
    }
  }
  
  // Set autoplay on/off
  function setAutoplay(state) {
    autoplay = Boolean(state);
  }
  
  // Bind a callback for video changes
  function onVideoChange(callback) {
    onChangeCallback = callback;
  }
  
  // For autoplay sequencing (e.g., after embed finishes)
  function handleVideoEnd() {
    if (autoplay) {
      nextVideo();
    }
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
    handleVideoEnd
  };
  