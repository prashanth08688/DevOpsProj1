// pomodoro.js
// Minimal Pomodoro timer logic (UI-independent)
// Save as: app/pomodoro.js

let duration = 25 * 60; // default 25 mins
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

function reset(newDuration = duration) {
  pause();
  duration = newDuration;
  remaining = duration;
  if (onTick) onTick(remaining);
}

function setCallbacks(tickCb, completeCb) {
  onTick = tickCb;
  onComplete = completeCb;
}

function setDuration(minutes) {
  duration = minutes * 60;
  remaining = duration;
}

function getRemaining() {
  return remaining;
}

module.exports = {
  start,
  pause,
  reset,
  setCallbacks,
  setDuration,
  getRemaining
};
