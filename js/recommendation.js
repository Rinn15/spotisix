/* SpotiSix — cá nhân hóa đề xuất dựa trên lịch sử nghe và log đề xuất. */
(function () {
  'use strict';

  const STORAGE_PREFIX = 'spotisix.recommendationHistory.v1';
  const RECOMMENDATION_LOG_PREFIX = 'spotisix.recommendationLog.v1';
  const RECENT_PLAY_WINDOW_MS = 24 * 60 * 60 * 1000;
  const RECOMMENDATION_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const MAX_ARTIST_PER_SET = 2;
  const MAX_GENRE_PER_SET = 3;
  const MAX_RECOMMENDATIONS = 8;
  function storageKey() {
    const userKey = typeof window.getSpotiSixUserKey === 'function' ? window.getSpotiSixUserKey() : '';
    return `${STORAGE_PREFIX}:${userKey || 'this-browser'}`;
  }
  function recommendationLogKey() {
    const userKey = typeof window.getSpotiSixUserKey === 'function' ? window.getSpotiSixUserKey() : '';
    return `${RECOMMENDATION_LOG_PREFIX}:${userKey || 'this-browser'}`;
  }
  const MAX_HISTORY_TRACKS = 500;
  let lastTrackKey = null;
  let lastPosition = null;
  let pendingSeconds = 0;
  let lastFlushAt = 0;
  let refreshOffset = 0;
  let refreshInProgress = false;
  let statusMessage = '';
  const impressionKeys = new Set();
  const recentRecommendationTimes = new Map();
  let displayedRecommendations = null;
  let displayedLibrarySize = -1;
  let recommendationHistoryUser = null;
  let recommendationHistoryLoading = null;
  let recommendationHistoryLoadingUser = null;

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
      genres: toArray(track.genres).concat(toArray(track.genre)),
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
    displayedRecommendations = null;
    lastTrackKey = trackKey(track);
    lastPosition = 0;
    pendingSeconds = 0;
    lastFlushAt = Date.now();
    render();
    void logImpression('home');
    window.dispatchEvent?.(new Event('spotisix:recommendations-updated'));
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

  // Dùng khóa riêng cho việc chống trùng trong danh sách đề xuất.
  // Với nhạc cộng đồng, publishedTrackId là định danh ổn định nhất.
  // Với nhạc thường, tên bài + nghệ sĩ giúp nhận ra cùng một bài
  // ngay cả khi dữ liệu xuất hiện ở nhiều bản ghi có ID khác nhau.
  function recommendationTrackKey(track) {
    if (!track) return '';
    if (track.publishedTrackId) return `community:${track.publishedTrackId}`;

    const title = normalize(track.title);
    const artist = normalize(track.artist);
    if (title && artist) return `song:${title}::${artist}`;

    return trackKey(track);
  }

  function artistKeys(track) {
    return [...new Set(String(track?.artist || '')
      .split(/\s*(?:,|&|\+|\bfeat(?:uring)?\.?\s*|\bft\.?\s*|\bx\s*|\bvà\b)\s*/i)
      .map(normalize)
      .filter(Boolean))];
  }

  function genreKeys(track) {
    const explicitGenres = [...features(track).genres];
    return [...new Set((explicitGenres.length ? explicitGenres : toArray(track?.tags)).map(normalize).filter(Boolean))];
  }

  function readRecommendationLog() {
    try {
      const parsed = JSON.parse(localStorage.getItem(recommendationLogKey()) || '{}');
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
    } catch (error) {
      console.warn('SpotiSix không thể đọc lịch sử đề xuất trên trình duyệt.', error);
      return {};
    }
  }

  function saveRecommendationLog(log) {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const [key, timestamp] of Object.entries(log)) {
      if (!Number.isFinite(Number(timestamp)) || Number(timestamp) < cutoff) delete log[key];
    }
    try {
      localStorage.setItem(recommendationLogKey(), JSON.stringify(log));
    } catch (error) {
      console.warn('SpotiSix không thể lưu lịch sử đề xuất trên trình duyệt.', error);
    }
  }

  function recentRecommendationTime(track) {
    const key = recommendationTrackKey(track);
    const localLog = readRecommendationLog();
    const timestamp = Math.max(Number(localLog[key]) || 0, recentRecommendationTimes.get(key) || 0);
    if (timestamp) recentRecommendationTimes.set(key, timestamp);
    return timestamp;
  }

  function rememberRecommendations(ranked, timestamp = Date.now()) {
    const log = readRecommendationLog();
    ranked.forEach(({ track }) => {
      const key = recommendationTrackKey(track);
      if (!key) return;
      log[key] = timestamp;
      recentRecommendationTimes.set(key, timestamp);
    });
    saveRecommendationLog(log);
  }

  function applyDiversityFilter(ranked, options = {}) {
    const limit = Math.max(0, Number(options.limit) || MAX_RECOMMENDATIONS);
    const offset = Math.max(0, Number(options.offset) || 0);
    const now = Number(options.now) || Date.now();
    const unique = applyRepeatFilter(ranked);
    const candidates = unique.map((item, index) => ({
      ...item,
      originalOrder: index,
      recommendedAt: recentRecommendationTime(item.track),
    }));
    candidates.sort((a, b) =>
      Number(a.recommendedAt > 0 && now - a.recommendedAt < RECOMMENDATION_COOLDOWN_MS) -
        Number(b.recommendedAt > 0 && now - b.recommendedAt < RECOMMENDATION_COOLDOWN_MS) ||
      ((a.recommendedAt > 0 && b.recommendedAt > 0) ? a.recommendedAt - b.recommendedAt : 0) ||
      b.score - a.score ||
      a.originalOrder - b.originalOrder
    );

    if (candidates.length > 1 && offset) {
      const rotation = offset % candidates.length;
      candidates.push(...candidates.splice(0, rotation));
    }

    const artistCounts = new Map();
    const genreCounts = new Map();
    const selected = [];
    const canAdd = candidate => {
      const artists = artistKeys(candidate.track);
      const genres = genreKeys(candidate.track);
      if (artists.some(artist => (artistCounts.get(artist) || 0) >= MAX_ARTIST_PER_SET)) return false;
      if (genres.some(genre => (genreCounts.get(genre) || 0) >= MAX_GENRE_PER_SET)) return false;
      return true;
    };
    const add = candidate => {
      const artists = artistKeys(candidate.track);
      const genres = genreKeys(candidate.track);
      selected.push(candidate);
      artists.forEach(artist => artistCounts.set(artist, (artistCounts.get(artist) || 0) + 1));
      genres.forEach(genre => genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1));
    };
    const passes = [
      candidates.filter(candidate => !candidate.recommendedAt || now - candidate.recommendedAt >= RECOMMENDATION_COOLDOWN_MS),
      candidates.filter(candidate => candidate.recommendedAt && now - candidate.recommendedAt < RECOMMENDATION_COOLDOWN_MS),
    ];
    passes.forEach(pass => pass.forEach(candidate => {
      if (selected.length < limit && canAdd(candidate)) add(candidate);
    }));
    return selected.map(({ originalOrder, recommendedAt, ...item }) => item);
  }

  // Danh sách đầu vào đã được xếp hạng; giữ bản xuất hiện đầu tiên
  // (tức bài có điểm/thứ hạng cao hơn) và loại các bản ghi trùng phía sau.
  function applyRepeatFilter(ranked) {
    const seen = new Set();
    return ranked.filter(item => {
      const key = recommendationTrackKey(item.track);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
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
    const lastPlayed = Number(entry.lastPlayed) || 0;
    if (lastPlayed > 0 && Date.now() - lastPlayed < RECENT_PLAY_WINDOW_MS) {
      score -= 18 * (1 - (Date.now() - lastPlayed) / RECENT_PLAY_WINDOW_MS);
    }
    const allSongs = typeof window.getSpotiSixSongs === 'function' ? window.getSpotiSixSongs() : (Array.isArray(window.songs) ? window.songs : []);
    if (currentIndex >= 0 && track === allSongs[currentIndex]) score -= 1000;
    return score;
  }

  function getRecommendations(offset = 0) {
    const allSongs = typeof window.getSpotiSixSongs === 'function' ? window.getSpotiSixSongs() : (Array.isArray(window.songs) ? window.songs : []);
    const currentIndex = typeof window.getSpotiSixCurrentIndex === 'function' ? window.getSpotiSixCurrentIndex() : -1;
    const history = readHistory();
    const preferences = buildPreferences(history);
    const hasHistory = Object.values(history).some(e => (e.playCount || 0) > 0 || (e.listenSeconds || 0) > 0 || e.liked);
    const ranked = allSongs.map((track, index) => ({
      track, index, score: scoreTrack(track, history, preferences, currentIndex),
      played: Number(history[trackKey(track)]?.playCount) || 0,
    })).filter(item => item.index !== currentIndex);
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
    // Lọc trùng sau khi xếp hạng để luôn giữ lại bản có thứ hạng cao nhất.
    const uniqueRanked = applyRepeatFilter(ranked);
    const recommendations = applyDiversityFilter(uniqueRanked, { offset });
    return { ranked: recommendations, hasHistory, total: uniqueRanked.length };
  }

  function getDiverseIndices(indices, options = {}) {
    const allSongs = typeof window.getSpotiSixSongs === 'function' ? window.getSpotiSixSongs() : [];
    const history = readHistory();
    const preferences = buildPreferences(history);
    const currentIndex = typeof window.getSpotiSixCurrentIndex === 'function' ? window.getSpotiSixCurrentIndex() : -1;
    const ranked = indices.map(index => ({
      index,
      track: allSongs[index],
      score: scoreTrack(allSongs[index], history, preferences, currentIndex),
    })).filter(item => item.track && item.index !== currentIndex);
    return applyDiversityFilter(ranked, options).map(item => item.index);
  }

  function getDiverseRanked(ranked, options = {}) {
    const currentIndex = typeof window.getSpotiSixCurrentIndex === 'function' ? window.getSpotiSixCurrentIndex() : -1;
    const normalized = ranked
      .filter(item => item.index !== currentIndex)
      .map(item => item.track ? item : { ...item, track: item.song });
    return applyDiversityFilter(normalized, options).map(({ track, ...item }) =>
      Object.hasOwn(item, 'song') ? { ...item, song: track } : { ...item, track }
    );
  }

  function render(options = {}) {
    const container = document.getElementById('spotisix-personal-recs');
    if (!container) return;
    if (!displayedRecommendations || displayedLibrarySize !== (window.getSpotiSixSongs?.() || []).length) {
      const current = getRecommendations(refreshOffset);
      displayedRecommendations = current.ranked;
      displayedLibrarySize = (window.getSpotiSixSongs?.() || []).length;
    }
    const { hasHistory } = getRecommendations(refreshOffset);
    const ranked = displayedRecommendations;
    container.replaceChildren();

    const heading = document.createElement('div');
    heading.className = 'section-title-row';
    const title = document.createElement('h2');
    title.textContent = 'Khám phá mới';
    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'see-all-btn spotisix-refresh-btn';
    refresh.textContent = refreshInProgress ? 'Đang làm mới…' : '⟳ Làm mới';
    refresh.disabled = refreshInProgress;
    refresh.setAttribute('aria-label', 'Làm mới danh sách gợi ý');
    refresh.addEventListener('click', refreshRecommendations);
    heading.append(title, refresh);
    container.appendChild(heading);

    const status = document.createElement('p');
    status.className = 'spotisix-recs-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.textContent = options.loading ? 'Đang làm mới danh sách gợi ý…' : statusMessage;
    status.hidden = !status.textContent;
    container.setAttribute('aria-busy', String(Boolean(options.loading)));
    container.appendChild(status);

    const description = document.createElement('p');
    description.className = 'spotisix-recs-description';
    description.textContent = hasHistory
      ? 'Đề xuất dựa trên lịch sử nghe và lượt thích, có giới hạn lặp nghệ sĩ/thể loại và tránh gợi ý lại bài gần đây.'
      : 'Nghe và yêu thích nhạc để SpotiSix cá nhân hóa đề xuất đa dạng hơn cho bạn.';
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
        void recordRecommendedPlay(track, 'home').catch(error =>
          console.warn('Không thể lưu lượt phát từ đề xuất Home.', error)
        );
        if (typeof window.playSong === 'function') window.playSong(index);
      });
      card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          void recordRecommendedPlay(track, 'home').catch(error =>
            console.warn('Không thể lưu lượt phát từ đề xuất Home.', error)
          );
          if (typeof window.playSong === 'function') window.playSong(index);
        }
      });
      row.appendChild(card);
    });
    if (ranked.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'home-recent-empty';
      empty.textContent = 'Chưa có bài hát để gợi ý. Hãy quay lại sau khi thư viện được tải.';
      row.appendChild(empty);
    }
    container.appendChild(row);
  }

  async function logRecommendations(eventType, ranked, source = 'home') {
    const loggable = ['impression', 'refresh', 'play'].includes(eventType);
    if (!loggable || !Array.isArray(ranked)) {
      throw new Error(`Loại log đề xuất không hợp lệ: ${eventType}`);
    }
    rememberRecommendations(ranked);
    const client = typeof window.getSpotiSixSupabaseClient === 'function'
      ? window.getSpotiSixSupabaseClient()
      : null;
    if (!client?.auth || typeof client.from !== 'function') return false;

    const { data, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;
    const userId = data?.session?.user?.id;
    if (!userId || data.session.access_token === 'demo-access-token') return false;

    const recommendations = ranked.map(({ track }) => ({
      track_key: recommendationTrackKey(track),
      track_id: track.publishedTrackId || track.id || null,
      title: track.title || '',
      artist: track.artist || '',
      genre: genreKeys(track),
    }));
    const { error } = await client.from('recommendation_logs').insert({
      user_id: userId,
      event_type: eventType,
      source,
      recommendations,
    });
    if (error) throw error;
    return true;
  }

  async function refreshRecommendations(options = {}) {
    if (refreshInProgress) return [];
    const source = options.source || 'home';
    const currentRecommendations = getRecommendations(refreshOffset);
    if (currentRecommendations.total > 1) refreshOffset = (refreshOffset + MAX_RECOMMENDATIONS) % currentRecommendations.total;
    refreshInProgress = true;
    statusMessage = '';
    if (source === 'home') render({ loading: true });

    let refreshedRanked = [];
    try {
      const { ranked } = getRecommendations(refreshOffset);
      refreshedRanked = ranked;
      displayedRecommendations = ranked;
      displayedLibrarySize = (window.getSpotiSixSongs?.() || []).length;
      await logRecommendations('refresh', ranked, source);
      statusMessage = 'Danh sách gợi ý đã được làm mới.';
    } catch (error) {
      console.warn('Không thể lưu nhật ký làm mới đề xuất lên Supabase.', error);
      statusMessage = 'Đã làm mới danh sách, nhưng chưa lưu được nhật ký đề xuất.';
    } finally {
      refreshInProgress = false;
      if (source === 'home') render();
    }
    return refreshedRanked;
  }

  async function logImpression(source = 'home', tracks = null) {
    const allSongs = typeof window.getSpotiSixSongs === 'function' ? window.getSpotiSixSongs() : [];
    const ranked = Array.isArray(tracks)
      ? tracks.map(trackOrIndex => {
        const index = Number.isInteger(trackOrIndex) ? trackOrIndex : allSongs.indexOf(trackOrIndex);
        const track = Number.isInteger(trackOrIndex) ? allSongs[trackOrIndex] : trackOrIndex;
        return { track, index, score: 0 };
      }).filter(item => item.track)
      : displayedRecommendations || getRecommendations().ranked;
    const signature = `${source}:${ranked.map(item => recommendationTrackKey(item.track)).join('|')}`;
    if (!ranked.length || impressionKeys.has(signature)) return;
    impressionKeys.add(signature);
    try {
      await logRecommendations('impression', ranked, source);
    } catch (error) {
      console.warn('Không thể lưu nhật ký hiển thị đề xuất lên Supabase.', error);
      statusMessage = 'Không thể lưu nhật ký đề xuất lên máy chủ.';
      if (source === 'home') render();
    }
  }

  function recordRecommendedPlay(track, source = 'home') {
    if (!track) return Promise.resolve(false);
    return logRecommendations('play', [{ track, index: -1, score: 0 }], source);
  }

  async function loadRecommendationHistory() {
    const client = typeof window.getSpotiSixSupabaseClient === 'function'
      ? window.getSpotiSixSupabaseClient()
      : null;
    if (!client?.auth || typeof client.from !== 'function') return false;
    const { data, error: sessionError } = await client.auth.getSession();
    if (sessionError) throw sessionError;
    const userId = data?.session?.user?.id;
    if (!userId || data.session.access_token === 'demo-access-token') {
      recommendationHistoryUser = null;
      recentRecommendationTimes.clear();
      impressionKeys.clear();
      displayedRecommendations = null;
      return false;
    }
    if (recommendationHistoryUser === userId) return true;
    if (recommendationHistoryLoading && recommendationHistoryLoadingUser === userId) {
      return recommendationHistoryLoading;
    }
    recentRecommendationTimes.clear();
    impressionKeys.clear();
    displayedRecommendations = null;
    recommendationHistoryLoadingUser = userId;

    recommendationHistoryLoading = (async () => {
      const since = new Date(Date.now() - RECOMMENDATION_COOLDOWN_MS).toISOString();
      const log = readRecommendationLog();
      const pageSize = 100;
      let offset = 0;
      while (true) {
        const { data: logs, error } = await client.from('recommendation_logs')
          .select('created_at, recommendations')
          .eq('user_id', userId)
          .gte('created_at', since)
          .order('created_at', { ascending: false })
          .range(offset, offset + pageSize - 1);
        if (error) throw error;
        (logs || []).forEach(entry => {
          const timestamp = new Date(entry.created_at).getTime();
          if (!Number.isFinite(timestamp)) return;
          (Array.isArray(entry.recommendations) ? entry.recommendations : []).forEach(track => {
            const key = track.track_key || (track.title && track.artist
              ? `song:${normalize(track.title)}::${normalize(track.artist)}`
              : '');
            if (!key) return;
            log[key] = Math.max(Number(log[key]) || 0, timestamp);
            recentRecommendationTimes.set(key, log[key]);
          });
        });
        if (!logs || logs.length < pageSize) break;
        offset += logs.length;
      }
      saveRecommendationLog(log);
      recommendationHistoryUser = userId;
      return true;
    })();

    try {
      return await recommendationHistoryLoading;
    } finally {
      if (recommendationHistoryLoadingUser === userId) {
        recommendationHistoryLoading = null;
        recommendationHistoryLoadingUser = null;
      }
    }

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
    void logImpression();
  }

  window.SpotisixRecommendations = {
    init,
    render,
    logImpression,
    logRecommendations,
    recordRecommendedPlay,
    loadRecommendationHistory,
    refresh: refreshRecommendations,
    getRecommendations,
    getDiverseIndices,
    getDiverseRanked,
    recordPlay,
    recordSkip,
    recordProgress,
    recordLike,
    flushProgress,
    applyRepeatFilter,
    applyDiversityFilter,
  };
  window.addEventListener('beforeunload', () => {
    const allSongs = typeof window.getSpotiSixSongs === 'function' ? window.getSpotiSixSongs() : (Array.isArray(window.songs) ? window.songs : []);
    const track = allSongs.find(item => trackKey(item) === lastTrackKey);
    if (track) flushProgress(track);
  });
})();
