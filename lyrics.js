const lyricsDialog = document.getElementById('lyrics-dialog');
const lyricsTrackLabel = document.getElementById('lyrics-track-label');
const lyricsStatus = document.getElementById('lyrics-status');
const lyricsLinesContainer = document.getElementById('lyrics-lines');
const expLyricsLinesContainer = document.getElementById('exp-lyrics-lines');
const expLyricsSub = document.getElementById('exp-lyrics-sub');
const player = document.getElementById('audio-player');
let lyrics = [];
let lyricLookupKey = '';
let lyricsRequestId = 0;
let activeLyricIndex = -1;

lyricsDialog.addEventListener('click', event => {
  if (event.target === lyricsDialog) window.closeLyrics();
});
lyricsDialog.addEventListener('cancel', window.closeLyrics);
window.toggleLyrics = function toggleLyrics(event) {
  event?.stopPropagation();
  if (lyricsDialog.open) {
    window.closeLyrics();
    return;
  }
  lyricsDialog.showModal();
  document.getElementById('lyrics-toggle').setAttribute('aria-expanded', 'true');
  const track = window.getSharedAudioTrack?.();
  if (track) void loadLyrics(track.title, track.artist, track);
};
window.closeLyrics = function closeLyrics() {
  if (lyricsDialog.open) lyricsDialog.close();
  document.getElementById('lyrics-toggle').setAttribute('aria-expanded', 'false');
};
window.addEventListener('spotisix:track-change', event => {
  const track = event.detail;
  if (!track?.title || !track?.artist) return;
  lyricsRequestId++;
  activeLyricIndex = -1;
  lyricLookupKey = '';
  lyrics = [];
  lyricsTrackLabel.textContent = `${track.title} · ${track.artist}`;
  lyricsLinesContainer.replaceChildren();
  if (expLyricsLinesContainer) {
    expLyricsLinesContainer.innerHTML = '<p class="exp-lyrics-loading">Đang tải lời bài hát…</p>';
  }
  lyricsStatus.textContent = 'Đang tìm lời bài hát…';
  lyricsStatus.classList.remove('hidden');
  void loadLyrics(track.title, track.artist, track);
});

window.renderExpLyrics = function renderExpLyrics() {
  if (lyrics && lyrics.length > 0) {
    renderLyricsList();
    renderCurrentLyric();
  } else {
    const track = window.getSharedAudioTrack?.();
    if (track) void loadLyrics(track.title, track.artist, track);
  }
};

window.loadLyricsForCurrentSong = function loadLyricsForCurrentSong() {
  const track = window.getSharedAudioTrack?.();
  if (track) void loadLyrics(track.title, track.artist, track);
};

player.addEventListener('timeupdate', renderCurrentLyric);
player.addEventListener('seeked', renderCurrentLyric);
window.addEventListener('spotisix:shared-playback-updated', renderCurrentLyric);

// ─── Online lyrics (LRCLIB) ──────────────────────────────────────
// Chỉ cần title + artist đúng (trong tracks.json hoặc bảng published_tracks
// trên Supabase) là lời được tìm tự động. Kết quả được cache trong localStorage.
const LYRICS_CACHE_KEY = 'spotisix.lyricsCache.v2';
const LYRICS_CACHE_MAX = 200;

function readLyricsCache() {
  try { return JSON.parse(localStorage.getItem(LYRICS_CACHE_KEY) || '{}'); } catch { return {}; }
}
function getCachedLyrics(key) {
  return readLyricsCache()[key] || null;
}
function setCachedLyrics(key, value) {
  try {
    const cache = readLyricsCache();
    cache[key] = { ...value, savedAt: Date.now() };
    const keys = Object.keys(cache);
    if (keys.length > LYRICS_CACHE_MAX) {
      keys.sort((a, b) => (cache[a].savedAt || 0) - (cache[b].savedAt || 0))
        .slice(0, keys.length - LYRICS_CACHE_MAX)
        .forEach(k => delete cache[k]);
    }
    localStorage.setItem(LYRICS_CACHE_KEY, JSON.stringify(cache));
  } catch { /* storage full or unavailable */ }
}

// Bỏ phần rác thường gặp trong tên file tải về: (Official MV), [Lyrics], .mp3, y2mate...
function cleanTrackTitle(title) {
  return String(title || '')
    .replace(/\.(mp3|m4a|wav|flac|ogg|aac)$/i, '')
    .replace(/^(y2mate(\.\w+)?|savefrom|ytmp3)\s*[-_]\s*/i, '')
    .replace(/[\(\[][^\)\]]*(official|lyric|mv|m\/v|audio|video|visualizer|karaoke|hd|4k)[^\)\]]*[\)\]]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function splitArtists(artist) {
  return String(artist || '')
    .replace(/\s+(?:và|x|ft\.?|feat\.?|with)\s+/gi, ',')
    .split(/\s*[,&\/;]\s*/)
    .map(name => name.replace(/\.+$/, '').trim())
    .filter(name => name && !/^(và|x|ft|feat|with|and)$/i.test(name));
}

async function fetchLrclib(path, attempts = 3) {
  let lastStatus = 0;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const response = await fetch(`https://lrclib.net/api/${path}`);
      if (response.ok) return { data: await response.json(), status: 200 };
      lastStatus = response.status;
      if (response.status === 404) return { data: null, status: 404 };
      if (response.status !== 503 && response.status !== 429 && response.status < 500) break;
    } catch {
      lastStatus = -1;
    }
    await new Promise(resolve => setTimeout(resolve, 600 * (attempt + 1)));
  }
  return { data: null, status: lastStatus };
}

function scoreLyricsMatch(item, wantedTitle, wantedArtists, duration) {
  if (!hasLyrics(item)) return -Infinity;
  const itemTitle = normalizeLyricsText(cleanTrackTitle(item.trackName || ''));
  const itemArtist = normalizeLyricsText(item.artistName || '');
  let score = 0;
  if (itemTitle === wantedTitle) score += 50;
  else if (itemTitle.includes(wantedTitle) || wantedTitle.includes(itemTitle)) score += 20;
  else return -Infinity; // tên bài khác hẳn -> bỏ, tránh hiện nhầm lời bài khác

  // Tránh nhầm bản remix/mashup khi bài gốc không phải remix
  const isRemixCandidate = /\b(remix|mashup|cover)\b|\sx\s/i.test(item.trackName || '');
  const wantsRemix = /\b(remix|mashup|cover)\b|\sx\s/i.test(wantedTitle);
  if (isRemixCandidate && !wantsRemix) score -= 40;

  if (wantedArtists.some(name => itemArtist.includes(name) || name.includes(itemArtist))) score += 30;
  if (item.syncedLyrics) score += 15;
  if (duration > 0 && item.duration) {
    const diff = Math.abs(item.duration - duration);
    if (diff <= 3) score += 20;
    else if (diff > 20) score -= 15;
  }
  return score;
}

async function findOnlineLyrics(title, artist, duration) {
  const cleanTitle = cleanTrackTitle(title);
  const artists = splitArtists(artist);
  const wantedTitle = normalizeLyricsText(cleanTitle);
  const wantedArtists = artists.map(normalizeLyricsText);
  let hadServerError = false;
  const track = status => { if (status !== 200 && status !== 404) hadServerError = true; };

  // 1) Khớp chính xác theo từng nghệ sĩ
  for (const name of [artist, ...artists].filter(Boolean)) {
    const params = new URLSearchParams({ track_name: cleanTitle, artist_name: name });
    if (duration > 0) params.set('duration', String(Math.round(duration)));
    const { data, status } = await fetchLrclib(`get?${params}`, 2);
    track(status);
    if (data?.syncedLyrics) return { result: data };
  }

  // 2) Tìm kiếm rồi chấm điểm kết quả
  const queries = [
    new URLSearchParams({ track_name: cleanTitle, artist_name: artists[0] || '' }),
    new URLSearchParams({ q: `${cleanTitle} ${artists[0] || ''}`.trim() }),
    new URLSearchParams({ q: cleanTitle }),
  ];
  let best = null;
  let bestScore = -Infinity;
  for (const query of queries) {
    const { data, status } = await fetchLrclib(`search?${query}`);
    track(status);
    if (!Array.isArray(data)) continue;
    for (const item of data) {
      const score = scoreLyricsMatch(item, wantedTitle, wantedArtists, duration);
      if (score > bestScore) { best = item; bestScore = score; }
    }
    if (best?.syncedLyrics && bestScore >= 80) break;
  }
  return { result: best, hadServerError };
}

function showLyricsResult(result, sourceLabel) {
  lyrics = parseSyncedLyrics(result.syncedLyrics || '');
  if (lyrics.length) {
    renderLyricsList();
    lyricsStatus.textContent = `${sourceLabel} Bấm vào câu bất kỳ để tua tới đoạn đó.`;
    renderCurrentLyric();
    return true;
  }
  if (result.plainLyrics) {
    renderPlainLyrics(result.plainLyrics);
    lyricsStatus.textContent = 'Bản lời này không có mốc thời gian nên không thể bấm để tua.';
    return true;
  }
  return false;
}

async function loadLocalLrc(track) {
  const urls = [];
  if (typeof track.lrc === 'string' && track.lrc) urls.push(track.lrc);
  // Chỉ tự đoán file .lrc với nhạc nằm trong project (./music/...), không phải URL Supabase/Cloudflare
  if (typeof track.audioSrc === 'string' && /^\.?\//.test(track.audioSrc)) {
    const guess = track.audioSrc.replace(/\.[^./\\]+$/, '.lrc');
    if (!urls.includes(guess)) urls.push(guess);
  }
  if (typeof track.title === 'string' && track.title.trim()) {
    const cleanTitle = track.title.trim();
    urls.push(`./music/${cleanTitle}.lrc`);
    urls.push(`./music/${cleanTitle.replace(/[?]/g, '_')}.lrc`);
  }
  for (const url of urls) {
    for (const candidate of [encodeURI(url), url]) {
      const response = await fetch(candidate, { cache: 'no-store' }).catch(() => null);
      if (!response?.ok) continue;
      const text = await response.text();
      if (parseSyncedLyrics(text).length) return text;
    }
  }
  return null;
}

async function loadLyrics(title, artist, trackObj = null) {
  const track = trackObj || window.getSharedAudioTrack?.() || {};
  const effectiveTitle = title || track.title || '';
  const effectiveArtist = artist || track.artist || '';
  const key = `${effectiveTitle}|${effectiveArtist}|${track.audioSrc || ''}`;
  if (lyricLookupKey === key && lyrics.length) {
    if (expLyricsLinesContainer && (!expLyricsLinesContainer.children.length || expLyricsLinesContainer.querySelector('.exp-lyrics-loading'))) {
      renderLyricsList();
      renderCurrentLyric();
    }
    return;
  }
  lyricLookupKey = key;
  const requestId = ++lyricsRequestId;
  lyrics = [];
  activeLyricIndex = -1;
  lyricsTrackLabel.textContent = `${effectiveTitle} · ${effectiveArtist}`;
  lyricsLinesContainer.replaceChildren();
  lyricsLinesContainer.classList.remove('has-synced-lines');
  lyricsStatus.textContent = 'Đang tìm lời bài hát…';
  lyricsStatus.classList.remove('hidden');
  const isStale = () => requestId !== lyricsRequestId;

  try {
    // 1. Lời nhúng sẵn trong dữ liệu bài hát
    if (track.lyrics && parseSyncedLyrics(track.lyrics).length) {
      showLyricsResult({ syncedLyrics: track.lyrics }, 'Lời bài hát (có sẵn).');
      return;
    }

    // 2. File .lrc chính xác đi kèm theo bài hát trong thư mục music/ (ưu tiên cao nhất cho nhạc nội bộ)
    const localText = await loadLocalLrc(track);
    if (isStale()) return;
    if (localText) {
      showLyricsResult({ syncedLyrics: localText }, 'Lời bài hát đồng bộ.');
      return;
    }

    // 3. Cache từ lần tìm LRCLIB trước
    const cacheKey = normalizeLyricsText(`${cleanTrackTitle(effectiveTitle)}|${effectiveArtist}`);
    const cached = getCachedLyrics(cacheKey);
    if (cached && showLyricsResult(cached, 'Lời bài hát từ LRCLIB (đã lưu).')) return;

    // 4. Tìm online trên LRCLIB chỉ bằng title + artist
    const duration = Number(track.duration) > 0 ? Number(track.duration)
      : (Number.isFinite(player.duration) ? player.duration : 0);
    const { result, hadServerError } = await findOnlineLyrics(effectiveTitle, effectiveArtist, duration);
    if (isStale()) return;
    if (result && hasLyrics(result)) {
      setCachedLyrics(cacheKey, { syncedLyrics: result.syncedLyrics || '', plainLyrics: result.plainLyrics || '' });
      showLyricsResult(result, 'Lời bài hát từ LRCLIB.');
      return;
    }

    lyricsStatus.textContent = hadServerError
      ? 'Máy chủ LRCLIB đang bận, hãy thử mở lại sau ít phút.'
      : `Không tìm thấy lời cho “${cleanTrackTitle(effectiveTitle)}” – ${effectiveArtist} trên LRCLIB. Hãy kiểm tra lại title/artist.`;
    if (expLyricsLinesContainer) {
      expLyricsLinesContainer.innerHTML = `<p class="exp-lyrics-loading">${hadServerError ? 'Máy chủ LRCLIB đang bận, thử lại sau ít phút.' : 'Chưa có lời cho bài hát này.'}</p>`;
    }
  } catch (error) {
    if (isStale()) return;
    lyricsStatus.textContent = `Không tải được lời bài hát: ${error.message}`;
    if (expLyricsLinesContainer) {
      expLyricsLinesContainer.innerHTML = '<p class="exp-lyrics-loading">Không tải được lời bài hát.</p>';
    }
  }
}

function hasLyrics(result) {
  return Boolean(result?.syncedLyrics || result?.plainLyrics);
}

function normalizeLyricsText(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLocaleLowerCase();
}

function parseSyncedLyrics(text) {
  const entries = [];
  text.split(/\r?\n/).forEach(rawLine => {
    const timestamps = [...rawLine.matchAll(/\[(\d{2}):(\d{2})(?:\.(\d{1,3}))?\]/g)];
    const text = rawLine.replace(/(?:\[\d{2}:\d{2}(?:\.\d{1,3})?\])+/g, '').trim();
    timestamps.forEach(([, minutes, seconds, fraction = '0']) => {
      entries.push({
        time: Number(minutes) * 60 + Number(seconds) + Number(`0.${fraction}`),
        text,
      });
    });
  });
  return entries.sort((first, second) => first.time - second.time);
}

function scrollElementIntoContainerCenter(container, element) {
  if (!container || !element) return;
  const containerHeight = container.clientHeight;
  const offsetRelativeToContainer = (element.getBoundingClientRect().top - container.getBoundingClientRect().top) + container.scrollTop;
  const targetTop = offsetRelativeToContainer - (containerHeight / 2) + (element.clientHeight / 2);
  container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
}

function renderCurrentLyric() {
  if (!lyrics.length) return;
  const playbackTime = window.isSharedListeningActive?.()
    ? (window.getSharedAudioTrack?.()?.currentTime ?? player.currentTime)
    : player.currentTime;
  const index = lyrics.findLastIndex(line => line.time <= playbackTime);
  const activeIndex = index >= 0 ? index : 0;
  const line = lyrics[activeIndex];
  if (activeLyricIndex === activeIndex) return;
  activeLyricIndex = activeIndex;

  const rows = lyricsLinesContainer.querySelectorAll('.lyrics-line');
  rows.forEach((row, rowIndex) => row.classList.toggle('active', rowIndex === activeIndex));
  if (rows[activeIndex]) {
    scrollElementIntoContainerCenter(lyricsLinesContainer.parentElement, rows[activeIndex]);
  }

  if (expLyricsLinesContainer) {
    const expRows = expLyricsLinesContainer.querySelectorAll('.lyrics-line');
    expRows.forEach((row, rowIndex) => row.classList.toggle('active', rowIndex === activeIndex));
    if (expRows[activeIndex]) {
      const viewport = document.getElementById('exp-lyrics-viewport') || expLyricsLinesContainer.parentElement;
      scrollElementIntoContainerCenter(viewport, expRows[activeIndex]);
    }
  }
}

function renderLyricsList() {
  const fragment = document.createDocumentFragment();
  const expFragment = document.createDocumentFragment();
  lyrics.forEach(line => {
    const row = document.createElement('p');
    row.className = 'lyrics-line';
    row.textContent = line.text || '♪';
    row.addEventListener('click', () => {
      if (window.getSharedListeningRole?.() === 'guest') return;
      player.currentTime = line.time;
      renderCurrentLyric();
    });
    fragment.appendChild(row);

    const expRow = document.createElement('p');
    expRow.className = 'lyrics-line exp-lyric-item';
    expRow.textContent = line.text || '♪';
    expRow.addEventListener('click', () => {
      if (window.getSharedListeningRole?.() === 'guest') return;
      player.currentTime = line.time;
      renderCurrentLyric();
    });
    expFragment.appendChild(expRow);
  });
  lyricsLinesContainer.replaceChildren(fragment);
  lyricsLinesContainer.classList.add('has-synced-lines');
  if (expLyricsLinesContainer) {
    expLyricsLinesContainer.replaceChildren(expFragment);
    expLyricsLinesContainer.classList.add('has-synced-lines');
  }
  if (expLyricsSub) expLyricsSub.textContent = 'Nhấn vào câu bất kỳ để phát đoạn đó';
  activeLyricIndex = -1;
}

function renderPlainLyrics(text) {
  const fragment = document.createDocumentFragment();
  const expFragment = document.createDocumentFragment();
  text.split(/\r?\n/).filter(line => line.trim()).forEach(line => {
    const row = document.createElement('p');
    row.className = 'lyrics-line';
    row.textContent = line.trim();
    fragment.appendChild(row);

    const expRow = document.createElement('p');
    expRow.className = 'lyrics-line exp-lyric-item';
    expRow.textContent = line.trim();
    expFragment.appendChild(expRow);
  });
  lyricsLinesContainer.replaceChildren(fragment);
  if (expLyricsLinesContainer) {
    expLyricsLinesContainer.replaceChildren(expFragment);
  }
  if (expLyricsSub) expLyricsSub.textContent = 'Lời bài hát thường (không có mốc thời gian)';
}
