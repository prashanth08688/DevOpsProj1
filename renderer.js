// example snippet in renderer.js
document.getElementById('loadBtn').addEventListener('click', async () => {
  const url = document.getElementById('videoUrl').value.trim();
  if (!url) return alert('Paste a YouTube URL first');
  // show interim UI
  document.getElementById('title').textContent = 'Loading...';
  document.getElementById('description').textContent = 'Fetching...';
  document.getElementById('commentsList').innerHTML = '<li class="small muted">Loading comments…</li>';
  document.getElementById('player').src = ''; // will be set by main result

  try {
    const res = await window.electronAPI.fetchYouTubeData(url);
    if (!res || !res.ok) {
      alert('Failed to fetch video data: ' + (res?.error || 'unknown'));
      return;
    }

    // set iframe
    document.getElementById('player').src = `https://www.youtube.com/embed/${res.videoId}?rel=0&modestbranding=1`;

    if (res.oembed && res.oembed.title) document.getElementById('title').textContent = res.oembed.title;
    else document.getElementById('title').textContent = 'Title unavailable';

    if (res.description) document.getElementById('description').textContent = res.description;
    else document.getElementById('description').textContent = 'Description unavailable';

    if (res.oembed && res.oembed.thumbnail_url) {
      document.getElementById('thumb').innerHTML = `<img src="${res.oembed.thumbnail_url}" alt="thumb">`;
    } else {
      document.getElementById('thumb').innerHTML = '';
    }

    if (res.comments && res.comments.length) {
      document.getElementById('commentsList').innerHTML = res.comments.map(c => `<li>${c}</li>`).join('');
    } else {
      document.getElementById('commentsList').innerHTML = '<li class="small muted">No comments available (best-effort).</li>';
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
});
