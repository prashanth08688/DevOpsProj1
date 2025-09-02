// pomodoro.js
// Minimal Pomodoro timer logic (UI-independent)
// Save as: app/pomodoro.js

let originalDuration = 25 * 60; // default 25 mins
let duration = originalDuration;
let remaining = duration;
let timer = null;
let onTick = null;
let onComplete = null;

function start() {
  if (timer) return; // already running
  timer = setInterval(() => {
    remaining--;
    if (onTick) onTick(remaining);

    if (remaining <= 0) {
      clearInterval(timer);
      timer = null;
      if (onComplete) onComplete();
    }
  }, 1000);
}

function pause() {
  clearInterval(timer);
  timer = null;
}

function reset() {
  pause();
  remaining = duration; // Reset to current duration
  if (onTick) onTick(remaining);
}

function resetToOriginal() {
  pause();
  duration = originalDuration;
  remaining = duration;
  if (onTick) onTick(remaining);
}

function setCallbacks(tickCb, completeCb) {
  onTick = tickCb;
  onComplete = completeCb;
}

function setDuration(minutes) {
  originalDuration = minutes * 60;
  duration = originalDuration;
  remaining = duration;
}

function getRemaining() {
  return remaining;
}

module.exports = {
  start,
  pause,
  reset,
  resetToOriginal,
  setCallbacks,
  setDuration,
  getRemaining
};
