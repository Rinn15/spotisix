const toggle = document.getElementById('karaoke-toggle');
const dialog = document.getElementById('karaoke-dialog');
const vocalSlider = document.getElementById('karaoke-vocal');
const vocalValue = document.getElementById('karaoke-vocal-value');
const statusText = document.getElementById('karaoke-status');
const lyricsContainer = document.getElementById('karaoke-lyrics');
const lyricsDialog = document.getElementById('lyrics-dialog');
const lyricsTrackLabel = document.getElementById('lyrics-track-label');
const lyricsStatus = document.getElementById('lyrics-status');
const lyricsLinesContainer = document.getElementById('lyrics-lines');
const expLyricsLinesContainer = document.getElementById('exp-lyrics-lines');
const expLyricsSub = document.getElementById('exp-lyrics-sub');
const player = document.getElementById('audio-player');
let karaoke = null;
let lyrics = [];
let lyricLookupKey = '';
let lyricsRequestId = 0;
let activeLyricIndex = -1;
let currentFileUrl = '';
let processing = false;
let activeTrackUrl = '';

window.toggleKaraoke = function toggleKaraoke() {
  if (karaoke) {
    stopKaraoke();
    return;
  }
  if (!activeTrackUrl) return;
  if (!dialog.open) dialog.showModal();
  void startKaraoke();
};

window.closeKaraokeDialog = function closeKaraokeDialog() {
  if (dialog.open) dialog.close();
  if (!karaoke) stopKaraoke();
};

dialog.addEventListener('click', event => {
  if (event.target === dialog) window.closeKaraokeDialog();
});
dialog.addEventListener('cancel', () => {
  if (!karaoke) stopKaraoke();
});

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

vocalSlider.addEventListener('input', () => {
  vocalValue.textContent = `${vocalSlider.value}%`;
  const expVocalSlider = document.getElementById('exp-vocal-slider');
  const expVocalVal = document.getElementById('exp-vocal-val');
  if (expVocalSlider) expVocalSlider.value = vocalSlider.value;
  if (expVocalVal) expVocalVal.textContent = `${vocalSlider.value}%`;
  if (karaoke) karaoke.vocalGain.gain.value = Number(vocalSlider.value) / 100;
});

window.syncKaraokeVocalSlider = function(val) {
  if (vocalSlider) vocalSlider.value = val;
  if (vocalValue) vocalValue.textContent = `${val}%`;
  const expVocalSlider = document.getElementById('exp-vocal-slider');
  const expVocalVal = document.getElementById('exp-vocal-val');
  if (expVocalSlider) expVocalSlider.value = val;
  if (expVocalVal) expVocalVal.textContent = `${val}%`;
  if (karaoke) karaoke.vocalGain.gain.value = Number(val) / 100;
};

player.addEventListener('play', () => void syncStemPlayback(true));
player.addEventListener('play', () => window.setTimeout(updateKaraokeAvailability, 0));
player.addEventListener('pause', () => void syncStemPlayback(false));
player.addEventListener('timeupdate', () => {
  syncStemPosition();
  renderCurrentLyric();
});
player.addEventListener('seeked', syncStemPosition);
player.addEventListener('ended', () => void syncStemPlayback(false));
player.addEventListener('loadedmetadata', updateKaraokeAvailability);
player.addEventListener('emptied', updateKaraokeAvailability);

function updateKaraokeAvailability() {
  const track = window.getSharedAudioTrack?.();
  activeTrackUrl = track?.audioSrc || '';
  toggle.disabled = !activeTrackUrl || window.isSharedListeningActive?.() || processing;
  toggle.title = activeTrackUrl ? 'Hát karaoke' : 'Nhập tệp nhạc để bật karaoke';
  if (karaoke && currentFileUrl !== activeTrackUrl) stopKaraoke();
}
window.updateKaraokeAvailability = updateKaraokeAvailability;

async function startKaraoke() {
  if (window.isSharedListeningActive?.()) {
    setStatus('Hãy rời phòng nghe chung trước khi bật karaoke.');
    return;
  }
  const track = window.getSharedAudioTrack?.();
  if (!track?.audioSrc) {
    setStatus('Karaoke chỉ khả dụng với tệp nhạc bạn đã tải lên. Hãy nhập một tệp âm thanh trước.');
    return;
  }
  if (processing) return;
  toggle.disabled = true;
  vocalSlider.disabled = true;
  try {
    const stems = await requestStems(track.audioSrc);
    if (!dialog.open || window.getSharedAudioTrack?.().audioSrc !== track.audioSrc) return;
    await activateStems(stems, track.audioSrc);
    await loadLyrics(track.title, track.artist, track);
    toggle.classList.add('karaoke-active');
    toggle.setAttribute('aria-pressed', 'true');
    setStatus('Đã tách vocal và beat. Kéo thanh vocal về 0% để tắt hoàn toàn giọng ca sĩ.');
  } catch (error) {
    stopKaraoke();
    setStatus(error.message || 'Không thể xử lý tệp karaoke.');
  } finally {
    vocalSlider.disabled = !karaoke;
    updateKaraokeAvailability();
  }
}

async function requestStems(fileUrl) {
  const client = window.getNearbySupabaseClient?.();
  if (!client) throw new Error('Không thể kết nối dịch vụ. Hãy tải lại trang và đăng nhập.');
  const { data: sessionData, error: sessionError } = await client.auth.getSession();
  if (sessionError) throw new Error(`Không thể kiểm tra đăng nhập: ${sessionError.message}`);
  if (!sessionData.session) throw new Error('Đăng nhập để sử dụng karaoke.');

  let response;
  try {
    response = await fetch(fileUrl);
  } catch {
    throw new Error('Không thể đọc tệp âm thanh. Hãy nhập lại tệp từ thiết bị của bạn.');
  }
  if (!response.ok) throw new Error('Không thể đọc tệp âm thanh đã tải lên.');
  const file = await response.blob();
  if (!file.type.startsWith('audio/')) throw new Error('Định dạng tệp này không được hỗ trợ.');
  if (!file.size || file.size > 25 * 1024 * 1024) throw new Error('Tệp karaoke phải nhỏ hơn hoặc bằng 25 MB.');

  processing = true;
  setStatus('Đang gửi tệp và tách vocal/beat. Có thể mất vài phút...');
  let objectPath = '';
  try {
    const extension = String(file.name || '').match(/\.(mp3|wav|m4a|flac|ogg|aac)$/i)?.[0] || '';
    objectPath = `${sessionData.session.user.id}/${crypto.randomUUID()}${extension}`;
    const { error: uploadError } = await client.storage.from('karaoke-inputs').upload(objectPath, file, {
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) throw new Error(`Không thể tải tệp karaoke lên: ${uploadError.message}`);
    let started;
    try {
      const result = await client.functions.invoke('karaoke', { body: { objectPath } });
      if (result.error) throw new Error(result.data?.error || result.error.message);
      started = result.data;
    } catch (error) {
      const { error: cleanupError } = await client.storage.from('karaoke-inputs').remove([objectPath]);
      if (cleanupError) console.error('Could not remove an interrupted karaoke upload.', cleanupError);
      throw error;
    }
    if (!started?.jobId) throw new Error(started?.error || 'Dịch vụ không trả về mã xử lý karaoke.');

    const deadline = Date.now() + 5 * 60 * 1000;
    while (Date.now() < deadline) {
      await new Promise(resolve => window.setTimeout(resolve, 2000));
      const { data, error } = await client.functions.invoke('karaoke', {
        body: { action: 'status', jobId: started.jobId },
      });
      if (error) throw new Error(data?.error || error.message);
      if (data?.status === 'succeeded' && data.vocalsUrl && data.instrumentalUrl) return data;
      if (data?.status === 'failed' || data?.status === 'canceled') {
        throw new Error(data.error || 'Không thể tách vocal từ tệp này.');
      }
      if (data?.error) throw new Error(data.error);
    }
    throw new Error('Tách vocal đang mất nhiều thời gian. Hãy thử lại sau.');
  } finally {
    processing = false;
  }
}

async function activateStems(stems, fileUrl) {
  stopStems();
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) throw new Error('Trình duyệt này không hỗ trợ phát karaoke.');
  const context = new AudioContextConstructor();
  const vocalAudio = createStemAudio(stems.vocalsUrl);
  const instrumentalAudio = createStemAudio(stems.instrumentalUrl);
  const vocalGain = context.createGain();
  const instrumentalGain = context.createGain();
  vocalGain.gain.value = Number(vocalSlider.value) / 100;
  instrumentalGain.gain.value = 1;
  for (const [audio, gain] of [[vocalAudio, vocalGain], [instrumentalAudio, instrumentalGain]]) {
    const source = context.createMediaElementSource(audio);
    source.connect(gain);
    gain.connect(context.destination);
  }
  karaoke = { context, vocalAudio, instrumentalAudio, vocalGain, fileUrl };
  currentFileUrl = fileUrl;
  window.setKaraokeMuted?.(true);
  if (context.state === 'suspended') await context.resume();
  await Promise.all([waitForMetadata(vocalAudio), waitForMetadata(instrumentalAudio)]);
  vocalSlider.disabled = false;
  syncStemPosition();
  if (!player.paused) await syncStemPlayback(true);
}

function createStemAudio(url) {
  const audio = new Audio();
  audio.crossOrigin = 'anonymous';
  audio.preload = 'auto';
  audio.src = url;
  return audio;
}

function waitForMetadata(audio) {
  if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) return Promise.resolve();
  return new Promise((resolve, reject) => {
    audio.addEventListener('loadedmetadata', resolve, { once: true });
    audio.addEventListener('error', () => reject(new Error('Không thể tải stem karaoke. Kiểm tra kết nối mạng rồi thử lại.')), { once: true });
  });
}

async function syncStemPlayback(shouldPlay) {
  if (!karaoke) return;
  if (shouldPlay) {
    for (const audio of [karaoke.vocalAudio, karaoke.instrumentalAudio]) {
      try {
        await audio.play();
      } catch (error) {
        setStatus(`Không thể phát stem karaoke: ${error.message}`);
      }
    }
  } else {
    karaoke.vocalAudio.pause();
    karaoke.instrumentalAudio.pause();
  }
}

function syncStemPosition() {
  if (!karaoke) return;
  if (currentFileUrl !== window.getSharedAudioTrack?.().audioSrc) {
    stopKaraoke();
    setStatus('Đã đổi bài hát; bật karaoke lại cho tệp mới.');
    return;
  }
  const time = player.currentTime;
  for (const audio of [karaoke.vocalAudio, karaoke.instrumentalAudio]) {
    if (Number.isFinite(time) && Math.abs(audio.currentTime - time) > 0.35) {
      try {
        audio.currentTime = time;
      } catch {
        setStatus('Không thể đồng bộ stem karaoke với bài hát.');
      }
    }
  }
}

function stopKaraoke() {
  stopStems();
  window.setKaraokeMuted?.(false);
  vocalSlider.disabled = true;
  toggle.classList.remove('karaoke-active');
  toggle.setAttribute('aria-pressed', 'false');
  lyricsContainer.textContent = 'Lyrics sẽ hiển thị tại đây.';
  if (dialog.open) dialog.close();
  updateKaraokeAvailability();
}

function stopStems() {
  if (!karaoke) return;
  karaoke.vocalAudio.pause();
  karaoke.instrumentalAudio.pause();
  karaoke.vocalAudio.removeAttribute('src');
  karaoke.instrumentalAudio.removeAttribute('src');
  void karaoke.context.close();
  karaoke = null;
  currentFileUrl = '';
}

// ─── Online lyrics (LRCLIB) ──────────────────────────────────────
// Chỉ cần title + artist đúng (trong tracks.json hoặc bảng published_tracks
// trên Supabase) là lời được tìm tự động. Kết quả được cache trong localStorage.
const LYRICS_CACHE_KEY = 'spotisix.lyricsCache.v1';
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
    lyricsContainer.textContent = result.plainLyrics;
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
  if (lyricLookupKey === key && lyrics.length) return;
  lyricLookupKey = key;
  const requestId = ++lyricsRequestId;
  lyrics = [];
  activeLyricIndex = -1;
  lyricsTrackLabel.textContent = `${effectiveTitle} · ${effectiveArtist}`;
  lyricsLinesContainer.replaceChildren();
  lyricsLinesContainer.classList.remove('has-synced-lines');
  lyricsStatus.textContent = 'Đang tìm lời bài hát…';
  lyricsStatus.classList.remove('hidden');
  lyricsContainer.textContent = 'Đang tìm lyrics...';
  const isStale = () => requestId !== lyricsRequestId;

  try {
    // 1. Lời nhúng sẵn trong dữ liệu bài hát
    if (track.lyrics && parseSyncedLyrics(track.lyrics).length) {
      showLyricsResult({ syncedLyrics: track.lyrics }, 'Lời bài hát (có sẵn).');
      return;
    }

    // 2. Cache từ lần tìm trước
    const cacheKey = normalizeLyricsText(`${cleanTrackTitle(effectiveTitle)}|${effectiveArtist}`);
    const cached = getCachedLyrics(cacheKey);
    if (cached && showLyricsResult(cached, 'Lời bài hát từ LRCLIB (đã lưu).')) return;

    // 3. Tìm online trên LRCLIB chỉ bằng title + artist
    const duration = Number(track.duration) > 0 ? Number(track.duration)
      : (Number.isFinite(player.duration) ? player.duration : 0);
    const { result, hadServerError } = await findOnlineLyrics(effectiveTitle, effectiveArtist, duration);
    if (isStale()) return;
    if (result && hasLyrics(result)) {
      setCachedLyrics(cacheKey, { syncedLyrics: result.syncedLyrics || '', plainLyrics: result.plainLyrics || '' });
      showLyricsResult(result, 'Lời bài hát từ LRCLIB.');
      return;
    }

    // 4. Dự phòng: file .lrc trong thư mục music/
    const localText = await loadLocalLrc(track);
    if (isStale()) return;
    if (localText) {
      showLyricsResult({ syncedLyrics: localText }, 'Lời bài hát (file .lrc offline).');
      return;
    }

    lyricsStatus.textContent = hadServerError
      ? 'Máy chủ LRCLIB đang bận, hãy thử mở lại sau ít phút.'
      : `Không tìm thấy lời cho “${cleanTrackTitle(effectiveTitle)}” – ${effectiveArtist} trên LRCLIB. Hãy kiểm tra lại title/artist.`;
    lyricsContainer.textContent = 'Chưa có lyrics cho bài hát này.';
    if (expLyricsLinesContainer) {
      expLyricsLinesContainer.innerHTML = `<p class="exp-lyrics-loading">${hadServerError ? 'Máy chủ LRCLIB đang bận, thử lại sau ít phút.' : 'Chưa có lời cho bài hát này.'}</p>`;
    }
  } catch (error) {
    if (isStale()) return;
    lyricsStatus.textContent = `Không tải được lời bài hát: ${error.message}`;
    lyricsContainer.textContent = `Không tải được lyrics: ${error.message}`;
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

function renderCurrentLyric() {
  if (!lyrics.length) return;
  const index = lyrics.findLastIndex(line => line.time <= player.currentTime);
  const activeIndex = index >= 0 ? index : 0;
  const line = lyrics[activeIndex];
  lyricsContainer.textContent = line.text || '♪';
  if (activeLyricIndex === activeIndex) return;
  activeLyricIndex = activeIndex;

  const rows = lyricsLinesContainer.querySelectorAll('.lyrics-line');
  rows.forEach((row, rowIndex) => row.classList.toggle('active', rowIndex === activeIndex));
  rows[activeIndex]?.scrollIntoView({ block: 'center', behavior: 'smooth' });

  if (expLyricsLinesContainer) {
    const expRows = expLyricsLinesContainer.querySelectorAll('.lyrics-line');
    expRows.forEach((row, rowIndex) => row.classList.toggle('active', rowIndex === activeIndex));
    expRows[activeIndex]?.scrollIntoView({ block: 'center', behavior: 'smooth' });
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
      player.currentTime = line.time;
      renderCurrentLyric();
    });
    fragment.appendChild(row);

    const expRow = document.createElement('p');
    expRow.className = 'lyrics-line exp-lyric-item';
    expRow.textContent = line.text || '♪';
    expRow.addEventListener('click', () => {
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

function setStatus(message) {
  statusText.textContent = message;
}

dialog.addEventListener('close', () => {
  if (!karaoke) window.setKaraokeMuted?.(false);
});

updateKaraokeAvailability();
window.isKaraokeActive = () => Boolean(karaoke || processing || toggle.disabled);
