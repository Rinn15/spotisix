// ═══════════════════════════════════════════════════════════════════
//  PLAYER.JS — Mood Selector Card & Recommended Song List Logic
//  Tệp riêng cho logic Player: chọn tâm trạng & danh sách đề xuất
// ═══════════════════════════════════════════════════════════════════

// ─── Module State ────────────────────────────────────────────────
let playerActiveMoodId = null;   // syncs with app.js activeMoodId
let playerActiveFilter = 'Tất cả';

// ─── Font Awesome icon class mapping for each mood ──────────────
const moodIconMap = {
  chill:    'fa-solid fa-mug-hot',
  focus:    'fa-solid fa-headphones',
  energy:   'fa-solid fa-bolt',
  sad:      'fa-solid fa-cloud-rain',
  romantic: 'fa-solid fa-heart',
  workout:  'fa-solid fa-fire-flame-curved',
  sleep:    'fa-solid fa-moon',
  party:    'fa-solid fa-compact-disc',
};

// ─── Initialize ──────────────────────────────────────────────────
function initPlayerMoodUI() {
  // Sync with app-level mood state
  playerActiveMoodId = (typeof activeMoodId !== 'undefined') ? activeMoodId : 'chill';

  renderPlayerMoodCards();
  renderPlayerMoodRecs(playerActiveMoodId);
}

// ─── Render Mood Selector Cards ──────────────────────────────────
function renderPlayerMoodCards() {
  const container = document.getElementById('player-mood-cards');
  if (!container) return;
  container.innerHTML = '';

  const defs = (typeof moodDefinitions !== 'undefined') ? moodDefinitions : [];

  defs.forEach(mood => {
    const isActive = mood.id === playerActiveMoodId;
    const iconClass = moodIconMap[mood.id] || 'fa-solid fa-music';

    const card = document.createElement('div');
    card.className = `player-mood-card${isActive ? ' active' : ''}`;
    card.dataset.moodId = mood.id;
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', String(isActive));
    card.setAttribute('tabindex', '0');
    card.style.setProperty('--pmc-gradient', mood.gradient);
    card.style.setProperty('--pmc-accent', mood.accent);
    card.style.setProperty('--pmc-glow', mood.glow);

    card.innerHTML = `
      <div class="player-mood-card-aura" aria-hidden="true"></div>
      <div class="player-mood-card-top">
        <div class="player-mood-card-icon" style="color: ${mood.accent}">
          <i class="${iconClass}"></i>
        </div>
        <span class="player-mood-card-badge">${mood.badge.split('·')[0].trim()}</span>
      </div>
      <div class="player-mood-card-body">
        <h3 class="player-mood-card-name">${mood.name}</h3>
        <p class="player-mood-card-tagline">${mood.tagline}</p>
      </div>
      <div class="player-mood-card-footer">
        <span class="player-mood-card-check">
          <i class="fa-solid fa-check"></i>
          Đang chọn
        </span>
        <button class="player-mood-card-play" type="button" aria-label="Phát ngay ${mood.name}" title="Phát ngay">
          <i class="fa-solid fa-play"></i>
        </button>
      </div>
    `;

    // Click card → select mood
    card.addEventListener('click', () => {
      selectPlayerMood(mood.id);
    });

    // Keyboard
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectPlayerMood(mood.id);
      }
    });

    // Play button → select + play
    const playBtn = card.querySelector('.player-mood-card-play');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectPlayerMood(mood.id);
        if (typeof playMoodTracks === 'function') playMoodTracks(mood.id, false);
      });
    }

    container.appendChild(card);
  });
}

// ─── Select a Mood ───────────────────────────────────────────────
function selectPlayerMood(moodId) {
  playerActiveMoodId = moodId;
  playerActiveFilter = 'Tất cả';

  // Sync with app-level state if available
  if (typeof activeMoodId !== 'undefined') {
    activeMoodId = moodId;
  }
  if (typeof setActiveMood === 'function') {
    setActiveMood(moodId, false);
  }

  renderPlayerMoodCards();
  renderPlayerMoodRecs(moodId);
}

// ─── Scroll Mood Cards ───────────────────────────────────────────
function scrollPlayerMoods(direction) {
  const track = document.getElementById('player-mood-cards');
  if (!track) return;
  const scrollAmount = track.offsetWidth * 0.6;
  track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

// ─── Render Recommended Songs Panel ──────────────────────────────
function renderPlayerMoodRecs(moodId, filterTag) {
  filterTag = filterTag || playerActiveFilter;
  const panel = document.getElementById('player-mood-recs-panel');
  if (!panel) return;

  const defs = (typeof moodDefinitions !== 'undefined') ? moodDefinitions : [];
  const mood = defs.find(m => m.id === moodId) || defs[0];
  if (!mood) return;

  const allSongs = (typeof songs !== 'undefined') ? songs : [];
  const trackIndices = getPlayerMoodTracks(moodId, filterTag);
  const totalSec = trackIndices.reduce((s, idx) => s + (allSongs[idx]?.duration || 0), 0);
  const totalMin = Math.round(totalSec / 60);
  const iconClass = moodIconMap[moodId] || 'fa-solid fa-music';

  panel.style.setProperty('--mpr-accent', mood.accent);
  panel.style.setProperty('--mpr-gradient', `linear-gradient(180deg, ${mood.accent}18 0%, transparent 60%)`);
  panel.style.setProperty('--mpr-glow', mood.glow);

  panel.innerHTML = `
    <div class="mood-player-recs-backdrop" aria-hidden="true"></div>

    <!-- Header -->
    <div class="mood-player-recs-header">
      <div class="mood-player-recs-art" style="background: ${mood.gradient}; box-shadow: 0 8px 28px ${mood.glow};">
        <div class="mood-player-recs-art-icon">
          <i class="${iconClass}" style="font-size:36px; color:#fff; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3))"></i>
        </div>
        <span class="mood-player-recs-art-emoji">${mood.emoji}</span>
      </div>

      <div class="mood-player-recs-info">
        <div class="mood-player-recs-eyebrow">
          <span>✨</span>
          <span>DANH SÁCH ĐỀ XUẤT</span>
          <span class="badge-vibe">${mood.badge}</span>
        </div>
        <h2 class="mood-player-recs-title">Giai Điệu ${mood.name}</h2>
        <p class="mood-player-recs-desc">${mood.description}</p>
        <div class="mood-player-recs-meta">
          <span><strong>${trackIndices.length}</strong> bài hát</span>
          <span class="meta-dot">·</span>
          <span>khoảng <strong>${totalMin} phút</strong></span>
          <span class="meta-dot">·</span>
          <span class="match-score"><i class="fa-solid fa-star"></i> Độ khớp cảm xúc 99%</span>
        </div>
      </div>

      <div class="mood-player-recs-actions">
        <button class="mpr-action-btn primary" type="button" onclick="playerPlayMoodAll('${mood.id}')">
          <i class="fa-solid fa-play"></i>
          <span>Phát tất cả</span>
        </button>
        <button class="mpr-action-btn secondary" type="button" onclick="playerPlayMoodShuffle('${mood.id}')">
          <i class="fa-solid fa-shuffle"></i>
          <span>Trộn bài</span>
        </button>
        <button class="mpr-action-btn secondary" type="button" onclick="playerSaveMoodPlaylist('${mood.id}')">
          <i class="fa-solid fa-plus"></i>
          <span>Lưu playlist</span>
        </button>
        <button class="mpr-action-btn ghost" type="button" onclick="playerRefreshRecs('${mood.id}')">
          <i class="fa-solid fa-arrows-rotate"></i>
          <span>Đổi đề xuất</span>
        </button>
      </div>
    </div>

    <!-- Filter Tags -->
    <div class="mpr-filter-bar" role="tablist" aria-label="Bộ lọc con của tâm trạng">
      ${mood.tags.map(tag => `
        <button class="mpr-filter-pill${tag === filterTag ? ' active' : ''}" type="button" onclick="playerFilterTracks('${tag}')">
          ${tag === 'Tất cả' ? '🎵 ' + tag : tag}
        </button>
      `).join('')}
    </div>

    <!-- Track Table -->
    <div class="mpr-track-table">
      <div class="mpr-table-head">
        <span>#</span>
        <span>Tiêu đề bài hát</span>
        <span>Album</span>
        <span>Gắn thẻ</span>
        <span>◷ Thời lượng</span>
        <span>Thao tác</span>
      </div>
      <div class="mpr-track-list" id="player-mood-track-rows"></div>
    </div>
  `;

  // Populate track rows
  const rowsContainer = panel.querySelector('#player-mood-track-rows');
  const currentState = (typeof state !== 'undefined') ? state : { currentSong: -1, isPlaying: false, likedSongs: new Set() };

  trackIndices.forEach((songIdx, pos) => {
    const song = allSongs[songIdx];
    if (!song) return;
    const isPlayingThis = songIdx === currentState.currentSong && currentState.isPlaying;
    const isLiked = currentState.likedSongs?.has?.(songIdx);

    const row = document.createElement('div');
    row.className = `mpr-track-row${songIdx === currentState.currentSong ? ' playing' : ''}`;
    row.dataset.songIndex = String(songIdx);
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-label', `Phát bài ${song.title} của ${song.artist}`);

    row.innerHTML = `
      <div class="mpr-track-num-cell">
        <span class="mpr-track-num"></span>
        <div class="mpr-track-eq" aria-label="Đang phát">
          <span></span><span></span><span></span>
        </div>
        <button class="mpr-row-play-btn" type="button" aria-label="Phát">
          <i class="fa-solid fa-play"></i>
        </button>
      </div>
      <div class="mpr-track-title-cell">
        <img class="mpr-track-thumb" src="${song.img}" alt="${song.title}"/>
        <div class="mpr-track-details">
          <p class="mpr-track-name">${song.title}</p>
          <p class="mpr-track-artist">${song.artist}</p>
        </div>
      </div>
      <div class="mpr-track-album">${song.album}</div>
      <div>
        <span class="mpr-track-tag" style="color: ${mood.accent}; border-color: ${mood.accent}33; background: ${mood.accent}14;">
          ${song.tags?.[0] || '#' + mood.name.split(' ')[0]}
        </span>
      </div>
      <div class="mpr-track-dur">${playerFormatTime(song.duration)}</div>
      <div class="mpr-track-actions" onclick="event.stopPropagation()">
        <button class="mpr-like-btn${isLiked ? ' liked' : ''}" data-song-index="${songIdx}" type="button" onclick="playerToggleLike(event, ${songIdx})" aria-label="Yêu thích">
          <i class="fa-solid fa-heart"></i>
        </button>
        <button class="mpr-queue-btn" type="button" onclick="playerAddToQueue(event, ${songIdx})" aria-label="Thêm vào hàng chờ">
          <i class="fa-solid fa-plus"></i>
        </button>
      </div>
    `;

    row.addEventListener('click', () => {
      if (typeof playSong === 'function') playSong(songIdx);
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (typeof playSong === 'function') playSong(songIdx);
      }
    });

    rowsContainer.appendChild(row);
  });
}

// ─── Helper: get tracks for mood + filter ────────────────────────
function getPlayerMoodTracks(moodId, filterTag) {
  // Delegate to app-level function if available
  if (typeof getMoodTrackIndices === 'function') {
    return getMoodTrackIndices(moodId, filterTag || 'Tất cả');
  }

  // Fallback: filter from moodDefinitions
  const defs = (typeof moodDefinitions !== 'undefined') ? moodDefinitions : [];
  const mood = defs.find(m => m.id === moodId);
  if (!mood) return [];

  let indices = mood.trackIndices || [];
  const allSongs = (typeof songs !== 'undefined') ? songs : [];

  if (filterTag && filterTag !== 'Tất cả') {
    indices = indices.filter(idx => {
      const s = allSongs[idx];
      return s && s.tags && s.tags.some(t => t.toLowerCase().includes(filterTag.toLowerCase()));
    });
  }

  return indices;
}

// ─── Helper: format seconds → m:ss ──────────────────────────────
function playerFormatTime(seconds) {
  if (!seconds || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── Action Handlers ─────────────────────────────────────────────
function playerPlayMoodAll(moodId) {
  if (typeof playMoodTracks === 'function') playMoodTracks(moodId, false);
}

function playerPlayMoodShuffle(moodId) {
  if (typeof playMoodTracks === 'function') playMoodTracks(moodId, true);
}

function playerSaveMoodPlaylist(moodId) {
  if (typeof saveMoodToPlaylist === 'function') saveMoodToPlaylist(moodId);
}

function playerRefreshRecs(moodId) {
  if (typeof refreshMoodRecommendations === 'function') refreshMoodRecommendations(moodId);
  renderPlayerMoodRecs(moodId, playerActiveFilter);
}

function playerFilterTracks(tag) {
  playerActiveFilter = tag;
  renderPlayerMoodRecs(playerActiveMoodId, tag);
}

function playerToggleLike(event, songIdx) {
  event.stopPropagation();
  if (typeof toggleLike === 'function') toggleLike(event, songIdx);
  // Update button state visually
  const btn = event.currentTarget;
  if (btn) {
    btn.classList.toggle('liked');
  }
}

function playerAddToQueue(event, songIdx) {
  event.stopPropagation();
  if (typeof addToQueue === 'function') addToQueue(event, songIdx);
}

// ─── Auto Initialize when DOM is ready ───────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Small delay to let app.js data load first
  setTimeout(() => {
    initPlayerMoodUI();
  }, 100);
});
