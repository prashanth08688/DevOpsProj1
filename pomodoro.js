// app/pomodoro.js
// Optimized Pomodoro timer with boundary checks

let duration = 25 * 60; // default: 25 mins
let remaining = duration;
let timer = null;
let onTick = () => {};
let onComplete = () => {};

function start() {
  if (timer || remaining <= 0) return; // prevent double start / invalid
  timer = setInterval(() => {
    remaining = Math.max(0, remaining - 1); // ensure non-negative
    onTick(remaining);

    if (remaining === 0) {
      pause();
      onComplete();
    }
  }, 1000);
}

function pause() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function reset(newMinutes = duration / 60) {
  pause();
  setDuration(newMinutes);
  onTick(remaining);
}

function setCallbacks(tickCb = () => {}, completeCb = () => {}) {
  onTick = tickCb;
  onComplete = completeCb;
}

function setDuration(minutes) {
  if (typeof minutes !== "number" || minutes <= 0) {
    minutes = 25; // fallback to default
  }
  duration = minutes * 60;
  remaining = duration;
}

function getRemaining() {
  return remaining;
}

function isRunning() {
  return timer !== null;
}

module.exports = {
  start,
  pause,
  reset,
  setCallbacks,
  setDuration,
  getRemaining,
  isRunning
};
