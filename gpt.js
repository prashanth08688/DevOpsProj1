// gpt.js
// Simple wrapper for free GPT chat API (no paid keys)
// Save as: app/gpt.js

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Default free endpoint — replace if blocked
let GPT_ENDPOINT = 'https://api.gptfree.top/v1/chat/completions';

// Allow changing the endpoint at runtime
function setEndpoint(url) {
  GPT_ENDPOINT = url;
}

// Send a message and return assistant's reply
async function sendMessage(message, history = []) {
  try {
    const response = await fetch(GPT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          ...history,
          { role: 'user', content: message }
        ]
      })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '[No response]';
  } catch (err) {
    return `Error: ${err.message}`;
  }
}

module.exports = {
  setEndpoint,
  sendMessage
};
