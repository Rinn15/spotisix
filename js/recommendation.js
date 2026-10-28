/* SpotiSix — cá nhân hóa đề xuất dựa trên lịch sử nghe.
   Dữ liệu được lưu trong localStorage của trình duyệt hiện tại; không gửi lịch sử nghe lên máy chủ. */
(function () {
  'use strict';

  const STORAGE_PREFIX = 'spotisix.recommendationHistory.v1';
  function storageKey() {
    const userKey = typeof window.getSpotiSixUserKey === 'function' ? window.getSpotiSixUserKey() : '';
    return `${STORAGE_PREFIX}:${userKey || 'this-browser'}`;
  }
  const MAX_HISTORY_TRACKS = 500;
  let lastTrackKey = null;
  let lastPosition = null;
  let pendingSeconds = 0;
  let lastFlushAt = 0;

  function trackKey(track) {
    if (!track) return '';
    if (track.publishedTrackId) return `community:${track.publishedTrackId}`;
    if (track.id) return `id:${track.id}`;
    return `local:${String(track.title || '').trim().toLowerCase()}::${String(track.artist || '').trim().toLowerCase()}`;
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function toArray(value) {
    if (Array.isArray(value)) return value.map(normalize).filter(Boolean);
    if (typeof value === 'string' && value.trim()) return value.split(/[,;|]/).map(normalize).filter(Boolean);
    return [];
  }

  function features(track) {
    if (!track) return { moods: [], activities: [], genres: [], tags: [], artists: [] };
    return {
      moods: [...new Set([...toArray(track.moods), ...toArray(track.mood)])],
      activities: toArray(track.activity),
      genres: toArray(track.genre),
      tags: toArray(track.tags),
      artists: toArray(track.artist),
    };
  }

  function readHistory() {
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey()) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveHistory(history) {
    const entries = Object.entries(history);
    if (entries.length > MAX_HISTORY_TRACKS) {
      entries.sort((a, b) => (b[1].lastPlayed || 0) - (a[1].lastPlayed || 0));
      history = Object.fromEntries(entries.slice(0, MAX_HISTORY_TRACKS));
    }
    try {
      localStorage.setItem(storageKey(), JSON.stringify(history));
    } catch (error) {
      console.warn('SpotiSix không thể lưu lịch sử đề xuất trên trình duyệt.', error);
    }
  }

  function ensureEntry(history, track) {
    const key = trackKey(track);
    if (!key) return null;
    if (!history[key]) {
      history[key] = {
        title: track.title || '',
        artist: track.artist || '',
        mood: track.mood || '',
        moods: toArray(track.moods),
        activity: track.activity || '',
        genre: track.genre || '',
        tags: toArray(track.tags),
        playCount: 0,
        listenSeconds: 0,
        skipCount: 0,
        liked: false,
        lastPlayed: 0,
      };
    } else {
      // Refresh metadata so newly assigned administrator mood labels are used.
      Object.assign(history[key], {
        title: track.title || history[key].title || '',
        artist: track.artist || history[key].artist || '',
        mood: track.mood || history[key].mood || '',
        moods: toArray(track.moods).length ? toArray(track.moods) : (history[key].moods || []),
        activity: track.activity || history[key].activity || '',
        genre: track.genre || history[key].genre || '',
        tags: toArray(track.tags).length ? toArray(track.tags) : (history[key].tags || []),
      });
    }
    return history[key];
  }

  function recordPlay(track) {
    if (!track) return;
    const history = readHistory();
    const entry = ensureEntry(history, track);
    if (!entry) return;
    entry.playCount = (entry.playCount || 0) + 1;
    entry.lastPlayed = Date.now();
    saveHistory(history);
    lastTrackKey = trackKey(track);
    lastPosition = 0;
    pendingSeconds = 0;
    lastFlushAt = Date.now();
    render();
  }

  function recordSkip(track, elapsedSeconds) {
    if (!track || !lastTrackKey || lastTrackKey !== trackKey(track)) return;
    const elapsed = Math.max(0, Number(elapsedSeconds) || 0);
    const duration = Number(track.duration) || 0;
    // Count as a skip only when the listener leaves early, not when a song is almost done.
    if (elapsed >= 5 && (!duration || elapsed < duration * 0.35)) {
      const history = readHistory();
      const entry = ensureEntry(history, track);
      if (entry) {
        entry.skipCount = (entry.skipCount || 0) + 1;
        saveHistory(history);
      }
    }
    lastTrackKey = null;
    lastPosition = null;
    pendingSeconds = 0;
    render();
  }

  function recordProgress(track, currentTime) {
    if (!track || !lastTrackKey || lastTrackKey !== trackKey(track)) return;
    const position = Number(currentTime);
    if (!Number.isFinite(position)) return;
    if (lastPosition !== null) {
      const delta = position - lastPosition;
      // Ignore seeks, backwards jumps, and suspiciously large time changes.
      if (delta > 0 && delta <= 2.5) pendingSeconds += delta;
    }
    lastPosition = position;
    if (pendingSeconds >= 5 || Date.now() - lastFlushAt >= 15000) {
      flushProgress(track);
    }
  }

  function flushProgress(track) {
    if (!track || pendingSeconds < 1) return;
    const history = readHistory();
    const entry = ensureEntry(history, track);
    if (entry) {
      entry.listenSeconds = Math.max(0, Number(entry.listenSeconds) || 0) + Math.floor(pendingSeconds);
      saveHistory(history);
    }
    pendingSeconds = pendingSeconds % 1;
    lastFlushAt = Date.now();
    render();
  }

  function recordLike(track, liked) {
    if (!track) return;
    const history = readHistory();
    const entry = ensureEntry(history, track);
    if (!entry) return;
    entry.liked = Boolean(liked);
    saveHistory(history);
    render();
  }

  function buildPreferences(history) {
    const preferences = { moods: {}, activities: {}, genres: {}, tags: {}, artists: {} };
    const add = (bucket, value, weight) => {
      if (value) bucket[value] = (bucket[value] || 0) + weight;
    };
    Object.values(history).forEach(entry => {
      const plays = Number(entry.playCount) || 0;
      const seconds = Number(entry.listenSeconds) || 0;
      const skips = Number(entry.skipCount) || 0;
      const liked = entry.liked ? 1 : 0;
      if (plays <= 0 && seconds <= 0 && !liked) return;
      // A real listen and a like contribute positively; frequent early skips reduce weight.
      const weight = Math.max(0.1, Math.min(8, Math.log2(plays + 1) + Math.min(seconds / 180, 3) + liked * 3 - skips * 0.8));
      const f = features(entry);
      f.moods.forEach(v => add(preferences.moods, v, weight));
      f.activities.forEach(v => add(preferences.activities, v, weight * 0.8));
      f.genres.forEach(v => add(preferences.genres, v, weight));
      f.tags.forEach(v => add(preferences.tags, v, weight * 0.8));
      f.artists.forEach(v => add(preferences.artists, v, weight * 0.7));
    });
    return preferences;
  }

  function scoreTrack(track, history, preferences, currentIndex) {
    const key = trackKey(track);
    const entry = history[key] || {};
    const f = features(track);
    let score = 0;
    const overlap = (values, bucket, points) => {
      values.forEach(value => {
        if (bucket[value]) score += points * Math.min(1, bucket[value] / 5);
      });
    };
    overlap(f.moods, preferences.moods, 24);
    overlap(f.activities, preferences.activities, 12);
    overlap(f.genres, preferences.genres, 24);
    overlap(f.tags, preferences.tags, 20);
    overlap(f.artists, preferences.artists, 12);

    // Prefer tracks with a positive personal history, but avoid endless repetition.
    score += Math.min(12, (Number(entry.listenSeconds) || 0) / 60);
    if (entry.liked) score += 16;
    score -= Math.min(18, (Number(entry.skipCount) || 0) * 5);
    score -= Math.min(14, (Number(entry.playCount) || 0) * 3);
    const allSongs = typeof window.getSpotiSixSongs === 'function' ? window.getSpotiSixSongs() : (Array.isArray(window.songs) ? window.songs : []);
    if (currentIndex >= 0 && track === allSongs[currentIndex]) score -= 1000;
    return score;
  }

  function getRecommendations() {
    const allSongs = typeof window.getSpotiSixSongs === 'function' ? window.getSpotiSixSongs() : (Array.isArray(window.songs) ? window.songs : []);
    const currentIndex = typeof window.getSpotiSixCurrentIndex === 'function' ? window.getSpotiSixCurrentIndex() : -1;
    const history = readHistory();
    const preferences = buildPreferences(history);
    const hasHistory = Object.values(history).some(e => (e.playCount || 0) > 0 || (e.listenSeconds || 0) > 0 || e.liked);
    const ranked = allSongs.map((track, index) => ({
      track, index, score: scoreTrack(track, history, preferences, currentIndex),
      played: Number(history[trackKey(track)]?.playCount) || 0,
    }));
    if (!hasHistory) {
      // Cold start: use community tracks with mood/activity labels first, then other tracks.
      ranked.sort((a, b) => {
        const aCommunity = a.track.publishedTrackId ? 1 : 0;
        const bCommunity = b.track.publishedTrackId ? 1 : 0;
        return bCommunity - aCommunity || a.index - b.index;
      });
    } else {
      ranked.sort((a, b) =>
        Number(a.played > 0) - Number(b.played > 0) ||
        b.score - a.score ||
        a.played - b.played ||
        a.index - b.index
      );
    }
    return { ranked: ranked.slice(0, 8), hasHistory };
  }

  function render() {
    const container = document.getElementById('spotisix-personal-recs');
    if (!container) return;
    const { ranked, hasHistory } = getRecommendations();
    container.replaceChildren();

    const heading = document.createElement('div');
    heading.className = 'section-title-row';
    const title = document.createElement('h2');
    title.textContent = 'Dành riêng cho bạn';
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'see-all-btn';
    refresh.textContent = 'Làm mới';
    refresh.addEventListener('click', render);
    heading.append(title, refresh);
    container.appendChild(heading);

    const description = document.createElement('p');
    description.className = 'spotisix-recs-description';
    description.textContent = hasHistory
      ? 'Đề xuất được xếp hạng từ lịch sử nghe, lượt thích và đặc điểm mood của bài hát.'
      : 'Nghe và yêu thích nhạc để SpotiSix dần cá nhân hóa đề xuất cho bạn.';
    container.appendChild(description);

    const row = document.createElement('div');
    row.className = 'scroll-row spotisix-recs-row';
    ranked.forEach(({ track, index, score }) => {
      const card = document.createElement('article');
      card.className = 'album-card spotisix-rec-card';
      card.tabIndex = 0;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `Phát ${track.title || 'bài hát'} của ${track.artist || 'nghệ sĩ chưa rõ'}`);
      const art = document.createElement('div');
      art.className = 'album-card-art';
      const img = document.createElement('img');
      img.src = track.img || 'album_lumina.jpg';
      img.alt = track.title || 'Bài hát';
      const overlay = document.createElement('div');
      overlay.className = 'album-card-overlay';
      overlay.innerHTML = '<span class="spotisix-rec-play" aria-hidden="true">▶</span>';
      art.append(img, overlay);
      const name = document.createElement('p');
      name.className = 'album-card-title';
      name.textContent = track.title || 'Bài hát không tên';
      const artist = document.createElement('p');
      artist.className = 'album-card-sub';
      artist.textContent = track.artist || 'Không rõ nghệ sĩ';
      const why = document.createElement('p');
      why.className = 'spotisix-rec-reason';
      const mood = toArray(track.moods).concat(toArray(track.mood)).filter(Boolean)[0];
      const activity = toArray(track.activity)[0];
      why.textContent = mood ? `Mood: ${mood}` : activity ? `Hoạt động: ${activity}` : (hasHistory ? 'Theo sở thích nghe' : 'Khám phá nhạc');
      card.append(art, name, artist, why);
      card.addEventListener('click', () => {
        if (typeof window.playSong === 'function') window.playSong(index);
      });
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (typeof window.playSong === 'function') window.playSong(index);
        }
      });
      row.appendChild(card);
    });
    container.appendChild(row);
  }

  function init() {
    const home = document.querySelector('#view-home .content-scroll');
    if (!home) return;
    if (!document.getElementById('spotisix-personal-recs')) {
      const section = document.createElement('section');
      section.id = 'spotisix-personal-recs';
      section.className = 'spotisix-personal-recs-section';
      const featured = home.querySelector('.featured-section');
      if (featured) home.insertBefore(section, featured);
      else home.prepend(section);
    }
    render();
  }

  window.SpotisixRecommendations = {
    init,
    render,
    recordPlay,
    recordSkip,
    recordProgress,
    recordLike,
    flushProgress,
  };
  window.addEventListener('beforeunload', () => {
    const allSongs = typeof window.getSpotiSixSongs === 'function' ? window.getSpotiSixSongs() : (Array.isArray(window.songs) ? window.songs : []);
    const track = allSongs.find(item => trackKey(item) === lastTrackKey);
    if (track) flushProgress(track);
  });
})();
