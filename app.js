// ═══════════════════════════════════════════════════════════════
//  SPOTISIX — Spotify-inspired music app logic
// ═══════════════════════════════════════════════════════════════

// ─── Data ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════
//  SPOTISIX — Spotify-inspired music app logic (Unified)
// ═══════════════════════════════════════════════════════════════

// ─── Data & Mood Definitions ─────────────────────────────────────
let songs = [
  { title: 'Celestial Vibe', artist: 'The Midnight Drive', album: 'Lumina', duration: 225, img: 'album_lumina.jpg', audioSrc: './music/celestial-vibe.mp3', mood: 'chill', tags: ['#Chill', '#Ambient'] },
  { title: 'Blue Note Sessions', artist: 'Miles & Co', album: 'Modern Jazz', duration: 390, img: 'album_jazz.jpg', audioSrc: './music/blue-note-sessions.mp3', mood: 'chill', tags: ['#Jazz', '#LateNight'] },
  { title: 'Overdrive Ignite', artist: 'Titan Forge', album: 'Iron & Sweat', duration: 265, img: 'album_aurora.jpg', audioSrc: '', mood: 'workout', tags: ['#Workout', '#HighBPM'] },
  { title: 'Cosmic Lullaby', artist: 'Stellar Drifter', album: 'Galaxy Sleep', duration: 380, img: 'album_lumina.jpg', audioSrc: '', mood: 'sleep', tags: ['#Sleep', '#DeepSleep'] },
  { title: 'Electric Carnival', artist: 'Bass Frequency', album: 'Rave Culture', duration: 310, img: 'album_nova.jpg', audioSrc: '', mood: 'party', tags: ['#Party', '#EDM'] }
];
const moodDefinitions = [
  {
    id: 'chill',
    name: 'Chill & Thư giãn',
    englishName: 'Chill & Relax',
    emoji: '🍃',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>',
    badge: 'BPM 65-80 · Lofi Chill',
    tagline: 'Xoa dịu mệt mỏi với giai điệu êm dịu, nhẹ nhàng',
    description: 'Tuyển tập những bản lofi, acoustic và jazz mộc mạc giúp bạn giải tỏa căng thẳng sau ngày dài học tập và làm việc.',
    gradient: 'linear-gradient(135deg, #0d324d 0%, #177174 50%, #4facfe 100%)',
    accent: '#38ef7d',
    glow: 'rgba(56, 239, 125, 0.35)',
    tags: ['Tất cả', 'Lofi Beats', 'Acoustic', 'Mưa rơi'],
    trackIndices: [1, 0, 6, 4, 11]
  },
  {
    id: 'focus',
    name: 'Tập trung cao độ',
    englishName: 'Deep Focus & Study',
    emoji: '🎧',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>',
    badge: 'BPM 60-75 · Deep Work',
    tagline: 'Kích thích sóng não, nâng cao hiệu suất làm việc',
    description: 'Âm thanh không lời, binaural beats và ambient tĩnh tại giúp bạn bước vào trạng thái Deep Work nhanh chóng.',
    gradient: 'linear-gradient(135deg, #09122c 0%, #1e3c72 50%, #2a5298 100%)',
    accent: '#00d2ff',
    glow: 'rgba(0, 210, 255, 0.35)',
    tags: ['Tất cả', 'Ambient', 'Synthwave', 'Binaural'],
    trackIndices: [2, 5, 0, 1, 16]
  },
  {
    id: 'energy',
    name: 'Tràn đầy năng lượng',
    englishName: 'Upbeat & Energy',
    emoji: '⚡',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
    badge: 'BPM 120-130 · Bứt phá',
    tagline: 'Giai điệu rộn ràng, tiếp thêm hứng khởi tích cực',
    description: 'Những bản synthwave, electro pop và nhịp trống sôi động thổi bùng ngọn lửa nhiệt huyết ngày mới.',
    gradient: 'linear-gradient(135deg, #780206 0%, #d83a17 50%, #f7b733 100%)',
    accent: '#f5af19',
    glow: 'rgba(245, 175, 25, 0.4)',
    tags: ['Tất cả', 'Electro', 'Synthwave', 'Pop Vui'],
    trackIndices: [3, 8, 10, 17, 2]
  },
  {
    id: 'sad',
    name: 'Tâm trạng & Suy tư',
    englishName: 'Melancholy & Rain',
    emoji: '🌧️',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16" y1="13" x2="16" y2="21"></line><line x1="8" y1="13" x2="8" y2="21"></line><line x1="12" y1="15" x2="12" y2="23"></line><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>',
    badge: 'BPM 65-80 · Lắng đọng',
    tagline: 'Đồng điệu với những nốt thăng trầm cảm xúc',
    description: 'Giai điệu piano và jazz sâu lắng, vỗ về những khoảng trống trong lòng giữa những ngày mưa rơi.',
    gradient: 'linear-gradient(135deg, #1f1c2c 0%, #443763 50%, #928dab 100%)',
    accent: '#a78bfa',
    glow: 'rgba(167, 139, 250, 0.35)',
    tags: ['Tất cả', 'Piano', 'Jazz Buồn', 'Nocturne'],
    trackIndices: [7, 13, 1, 4, 11]
  },
  {
    id: 'romantic',
    name: 'Lãng mạn & Ngọt ngào',
    englishName: 'Romance & Love',
    emoji: '💖',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
    badge: 'BPM 75-90 · Tình yêu',
    tagline: 'Giai điệu ngọt ngào cho những rung cảm trái tim',
    description: 'Những bản tình ca acoustic du dương và giọng ca ấm áp đồng hành cùng những phút giây tình yêu tuyệt đẹp.',
    gradient: 'linear-gradient(135deg, #650042 0%, #a81c62 50%, #ff758c 100%)',
    accent: '#f472b6',
    glow: 'rgba(244, 114, 182, 0.4)',
    tags: ['Tất cả', 'Acoustic', 'Ballad', 'Duet'],
    trackIndices: [9, 14, 0, 6, 4]
  },
  {
    id: 'workout',
    name: 'Tập luyện & Bứt phá',
    englishName: 'Workout & Fitness',
    emoji: '🔥',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path></svg>',
    badge: 'BPM 130-155 · Beast Mode',
    tagline: 'Đẩy nhịp tim tối đa, bứt phá mọi giới hạn thể lực',
    description: 'Bassline căng tràn, nhịp beat dồn dập kích thích adrenaline bùng nổ cho mỗi rep tập của bạn.',
    gradient: 'linear-gradient(135deg, #4a0000 0%, #8e0e00 50%, #1f1c18 100%)',
    accent: '#ff3366',
    glow: 'rgba(255, 51, 102, 0.45)',
    tags: ['Tất cả', 'Cardio', 'Heavy Bass', 'High BPM'],
    trackIndices: [10, 15, 3, 8, 17]
  },
  {
    id: 'sleep',
    name: 'Đêm muộn & Giấc ngủ',
    englishName: 'Sleep & Night Ambient',
    emoji: '🌙',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>',
    badge: 'BPM 50-60 · Ru ngủ',
    tagline: 'Âm thanh êm dịu đưa bạn vào giấc ngủ sâu thư thái',
    description: 'Không gian âm thanh êm ái kết hợp tiếng suối, gió đêm và sóng alpha nâng niu giấc ngủ của bạn.',
    gradient: 'linear-gradient(135deg, #070913 0%, #171c35 50%, #2f2a5e 100%)',
    accent: '#93c5fd',
    glow: 'rgba(147, 197, 253, 0.3)',
    tags: ['Tất cả', 'Sóng Alpha', 'Tiếng Mưa', 'Thiền Định'],
    trackIndices: [11, 16, 1, 7, 0]
  },
  {
    id: 'party',
    name: 'Tiệc tùng & Sôi động',
    englishName: 'Party & Dance Club',
    emoji: '🪩',
    iconSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>',
    badge: 'BPM 128-140 · Sàn nhảy',
    tagline: 'Bật nhạc căng đét, biến căn phòng thành lễ hội',
    description: 'House, EDM festival và dance pop bùng nổ cuốn bạn cùng bạn bè vào những bước nhảy không dứt.',
    gradient: 'linear-gradient(135deg, #3a0058 0%, #7b1fa2 50%, #f06292 100%)',
    accent: '#f43f5e',
    glow: 'rgba(244, 63, 94, 0.4)',
    tags: ['Tất cả', 'EDM', 'Club House', 'Festival'],
    trackIndices: [12, 17, 3, 10, 8]
  }
];

let activeMoodId = 'chill';
let activeMoodFilterTag = 'Tất cả';
const moodShuffleOffsets = new Map();

const playlistStorageKey = 'spotisix.playlists';
const likedSongsStorageKey = 'spotisix.likedSongs';
const deviceAudioDatabaseName = 'spotisix.device-audio';
const deviceAudioStoreName = 'tracks';
const defaultPlaylists = [
  { id: 'vi', name: 'vi', tracks: [0, 1, 2, 3, 4], cover: 'album_lumina.jpg', custom: false },
  { id: 'chill', name: 'Chill Mix', tracks: [1, 0, 2], cover: 'album_lofi.jpg', custom: false },
  { id: 'synth', name: 'Synthwave Drive', tracks: [3, 2, 0], cover: 'album_aurora.jpg', custom: false },
  { id: 'jazz', name: 'Jazz Sessions', tracks: [4, 0, 1], cover: 'album_jazz.jpg', custom: false },
];
let userPlaylists = [];
let activePlaylistId = 'vi';
let playlistSortMode = 'custom';
let activeTrackOrder = null;

// ─── State ───────────────────────────────────────────────────────
let state = {
  currentSong: 0,
  isPlaying: false,
  isShuffle: false,
  repeatMode: 0,
  isMuted: false,
  volume: 0.7,
  previousVolume: 0.7,
  progress: 0,       // 0–1
  elapsed: 0,        // seconds
  likedSongs: new Set([3]),
  playbackQueue: [0, 1, 2, 3, 4],
  queuePosition: 0,
  isExpanded: false,
};

let timerInterval = null;
let supabaseClient = null;
let authMode = 'signin';
const pendingConfirmationEmailKey = 'spotisix.pendingConfirmationEmail';
const recentSongsKey = 'spotisix.recentSongs';
const privacyModeKey = 'spotisix.privateSession';
const settingsKey = 'spotisix.settings';
const followedArtistsStorageKey = 'spotisix.followedArtists';
const defaultFollowedArtists = ['Nova', 'Aurora Borealis'];
let followedArtists = new Set(defaultFollowedArtists);
let spotifyAccessToken = null;
let spotifyTracks = [];
let audioPlayer = null;
let sharedListeningRole = null;
let sharedRemoteAudio = false;
let sharedTrackMetadata = null;
let spotifySearchTimeout = null;
let spotifySearchRequestId = 0;
const publishedTrackIndexes = new Map();
let recentSongIds = [];
let privateSession = localStorage.getItem(privacyModeKey) === 'true';
let librarySearchQuery = '';
let seekingPointerId = null;
let volumePointerId = null;

// ─── Music library manifest ───────────────────────────────────────
// Add tracks by editing music/tracks.json; app.js does not need editing.
async function loadMusicManifest() {
  try {
    const response = await fetch('./music/tracks.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const manifest = await response.json();
    if (!Array.isArray(manifest) || manifest.length === 0) {
      throw new Error('tracks.json must contain a non-empty array of tracks');
    }

    const validTracks = manifest.filter(track =>
      track && typeof track.title === 'string' && track.title.trim() &&
      typeof track.artist === 'string' && typeof track.audioSrc === 'string' && track.audioSrc.trim()
    ).map(track => ({
      title: track.title.trim(),
      artist: track.artist.trim() || 'Không rõ nghệ sĩ',
      album: typeof track.album === 'string' && track.album.trim() ? track.album.trim() : 'Bài hát của tôi',
      duration: Number.isFinite(Number(track.duration)) && Number(track.duration) > 0 ? Number(track.duration) : 0,
      img: typeof track.img === 'string' && track.img.trim() ? track.img.trim() : 'album_lumina.jpg',
      audioSrc: track.audioSrc.trim(),
      moods: Array.isArray(track.moods) ? track.moods : [],
      tags: Array.isArray(track.tags) ? track.tags : [],
    }));

    if (validTracks.length === 0) throw new Error('No valid tracks found in tracks.json');
    songs = validTracks;
    state.playbackQueue = songs.map((_, index) => index);
    // Keep default playlists valid when the manifest contains fewer than five tracks.
    defaultPlaylists.forEach(playlist => {
      playlist.tracks = playlist.tracks.filter(index => index < songs.length);
    });
    console.info(`SpotiSix loaded ${songs.length} track(s) from music/tracks.json`);
  } catch (error) {
    console.warn('Could not load music/tracks.json; using the built-in fallback list.', error);
  }
}

// ─── Init ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await loadMusicManifest();
  setGreeting();
  initializePlaylistFeatures();
  audioPlayer = document.getElementById('audio-player');
  window.setKaraokeMuted = muted => {
    audioPlayer.volume = muted || state.isMuted ? 0 : state.volume;
  };
  audioPlayer.addEventListener('timeupdate', updateNativeAudioProgress);
  audioPlayer.addEventListener('loadedmetadata', updateNativeAudioDuration);
  audioPlayer.addEventListener('ended', handleNativeAudioEnded);
  ['play', 'pause', 'seeked', 'timeupdate'].forEach(eventName => {
    audioPlayer.addEventListener(eventName, () => {
      if (sharedListeningRole === 'host') {
        window.dispatchEvent(new CustomEvent('spotisix:playback-change', {
          detail: getSharedPlaybackSnapshot(),
        }));
      }
    });
  });
  function getSharedPlaybackSnapshot() {
    const song = songs[state.currentSong];
    return {
      title: song.title,
      artist: song.artist,
      album: song.album,
      img: song.img,
      duration: song.duration,
      currentTime: audioPlayer?.currentTime || 0,
      isPlaying: state.isPlaying,
    };
  }
  window.getSharedAudioTrack = function getSharedAudioTrack() {
    const song = songs[state.currentSong];
    return {
      ...song,
      currentTime: audioPlayer?.currentTime || 0,
      isPlaying: state.isPlaying,
      audioElement: audioPlayer,
    };
  };
  window.setSharedListeningRole = function setSharedListeningRole(role) {
    sharedListeningRole = role;
  };
  window.applySharedPlaybackSnapshot = function applySharedPlaybackSnapshot(snapshot) {
    sharedTrackMetadata = {
      title: snapshot.title,
      artist: snapshot.artist,
      album: snapshot.album,
      img: snapshot.img || 'album_lumina.jpg',
      duration: snapshot.duration,
    };
    if (sharedRemoteAudio && Math.abs(audioPlayer.currentTime - snapshot.currentTime) > 1.5) {
      try {
        audioPlayer.currentTime = snapshot.currentTime;
      } catch {
        // The stream may not be seekable; retain the host's displayed position instead.
      }
    }
    if (sharedRemoteAudio && snapshot.isPlaying && audioPlayer.paused) {
      audioPlayer.play().catch(error => showAppToast(`Không thể phát âm thanh chung: ${error.message}`));
    } else if (sharedRemoteAudio && !snapshot.isPlaying && !audioPlayer.paused) {
      audioPlayer.pause();
    }
    state.elapsed = snapshot.currentTime;
    state.progress = snapshot.duration ? snapshot.currentTime / snapshot.duration : 0;
    state.isPlaying = snapshot.isPlaying;
    document.getElementById('npb-title').textContent = snapshot.title;
    document.getElementById('npb-artist').textContent = snapshot.artist;
    document.getElementById('expanded-title').textContent = snapshot.title;
    document.getElementById('expanded-artist').textContent = snapshot.artist;
    document.getElementById('expanded-album').textContent = snapshot.album;
    document.getElementById('queue-current-title').textContent = snapshot.title;
    document.getElementById('queue-current-artist').textContent = snapshot.artist;
    document.getElementById('npb-art').src = sharedTrackMetadata.img;
    document.getElementById('expanded-art-img').src = sharedTrackMetadata.img;
    document.querySelector('.queue-art').src = sharedTrackMetadata.img;
    document.getElementById('total-time').textContent = formatTime(snapshot.duration);
    document.getElementById('exp-total-time').textContent = formatTime(snapshot.duration);
    syncPlayIcons();
    updateProgress();
  };
  window.attachSharedAudioStream = async function attachSharedAudioStream(stream) {
    sharedRemoteAudio = true;
    audioPlayer.pause();
    audioPlayer.removeAttribute('src');
    audioPlayer.srcObject = stream;
    try {
      await audioPlayer.play();
    } catch (error) {
      showAppToast(`Chạm nút phát để nghe âm thanh chung: ${error.message}`);
    }
  };
  window.clearSharedAudio = function clearSharedAudio() {
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.srcObject = null;
    }
    sharedRemoteAudio = false;
    sharedTrackMetadata = null;
    sharedListeningRole = null;
    state.isPlaying = false;
    if (audioPlayer && songs[state.currentSong]?.audioSrc) audioPlayer.src = songs[state.currentSong].audioSrc;
    updatePlayerUI();
  };
  audioPlayer.addEventListener('error', () => {
    if (songs[state.currentSong]?.audioSrc) showAppToast('Không thể phát tệp âm thanh này. Hãy thử định dạng MP3, WAV hoặc M4A.');
  });
  updatePlayerUI();
  window.dispatchEvent(new CustomEvent('spotisix:track-change', {
    detail: { ...songs[state.currentSong] },
  }));
  buildUpNext();
  initializeAuth();
  initializeSpotify();
  initializeAccountFeatures();
  buildQueuePanel();
  void restoreDeviceAudio().catch(error => {
    console.error('Could not restore locally saved audio files.', error);
    showAppToast(`Không thể khôi phục nhạc trên thiết bị: ${error.message}`);
  });
  document.addEventListener('keydown', handlePlayerShortcuts);
  document.addEventListener('click', closeProfileMenuOnOutsideClick);
  document.getElementById('playlist-dialog').addEventListener('click', event => {
    if (event.target === event.currentTarget) closePlaylistDialog();
  });
  initializeMoodFeatures();
});

// ═══════════════════════════════════════════════════════════════════
//  MOOD SELECTOR & RECOMMENDED SONGS LOGIC
// ═══════════════════════════════════════════════════════════════════

function getSmartDefaultMood() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return 'energy';
  if (h >= 11 && h < 17) return 'focus';
  if (h >= 17 && h < 22) return 'chill';
  return 'sleep';
}

function initializeMoodFeatures() {
  const savedMood = localStorage.getItem('spotisix.activeMood');
  if (savedMood && moodDefinitions.some(m => m.id === savedMood)) {
    activeMoodId = savedMood;
  } else {
    activeMoodId = getSmartDefaultMood();
  }
  renderHomeMoodSelector();
  renderMoodRecommendations(activeMoodId);
}


function getMoodTrackIndices(moodId, filterTag = 'Tất cả') {
  // Chỉ lấy bài hát thực sự có Mood tương ứng.
  // Hỗ trợ cả bài mẫu dùng `mood`, bài mới dùng `moods`,
  // và bài đăng công khai từ Supabase.
  const normalizeMoodId = value => {
    const id = String(value || '').trim().toLowerCase();
    // Một số dữ liệu cũ dùng "bad" để chỉ Mood buồn; ID chuẩn trên web là "sad".
    return id === 'bad' ? 'sad' : id;
  };

  const targetMood = normalizeMoodId(moodId);
  let indices = songs
    .map((song, index) => ({ song, index }))
    .filter(({ song }) => {
      const songMoods = Array.isArray(song.moods) ? [...song.moods] : [];
      if (song.mood) songMoods.push(song.mood);
      return songMoods.some(mood => normalizeMoodId(mood) === targetMood);
    });

  // Lọc thêm theo thể loại hoặc từ khóa nếu người dùng chọn.
  if (filterTag && filterTag !== 'Tất cả' && filterTag !== 'all') {
    const keyword = filterTag.toLowerCase();

    indices = indices.filter(({ song }) => {
      const tags = Array.isArray(song.tags) ? song.tags : [];

      return (
        tags.some(tag => tag.toLowerCase().includes(keyword)) ||
        song.title.toLowerCase().includes(keyword) ||
        song.artist.toLowerCase().includes(keyword) ||
        song.album.toLowerCase().includes(keyword)
      );
    });
  }

  return indices.map(({ index }) => index);
}

function setActiveMood(moodId, shouldScroll = false) {
  const mood = moodDefinitions.find(m => m.id === moodId);
  if (!mood) return;
  activeMoodId = moodId;
  activeMoodFilterTag = 'Tất cả';
  localStorage.setItem('spotisix.activeMood', moodId);

  document.querySelectorAll('.mood-card').forEach(card => {
    const isTarget = card.dataset.moodId === moodId;
    card.classList.toggle('active', isTarget);
    card.setAttribute('aria-checked', String(isTarget));
  });

  renderMoodRecommendations(moodId);

  if (document.getElementById('view-mood')?.classList.contains('active')) {
    renderMoodView();
  }

  if (shouldScroll) {
    const panel = document.getElementById('mood-recommendations-panel') || document.getElementById('mood-hub-recommendations-panel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}

function scrollMoods(direction) {
  const container = document.getElementById('home-mood-cards');
  if (container) {
    container.scrollBy({ left: direction * 260, behavior: 'smooth' });
  }
}

function selectMoodFilter() {
  document.querySelectorAll('.home-filter-chip').forEach(c => c.classList.remove('active'));
  const moodChip = document.getElementById('chip-mood');
  if (moodChip) moodChip.classList.add('active');
  const section = document.getElementById('mood-section');
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    section.classList.add('highlight-pulse');
    setTimeout(() => section.classList.remove('highlight-pulse'), 1200);
  }
}

function shuffleArray(array) {
  const result = [...array];

  // Fisher–Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}


function playMoodTracks(moodId, shuffle = false) {
  if (sharedListeningRole === 'guest') {
    showAppToast('Chủ phòng điều khiển bài hát khi đang nghe chung.');
    return;
  }

  const mood = moodDefinitions.find(m => m.id === moodId);
  if (!mood) return;

  const tracks = getMoodTrackIndices(
    moodId,
    activeMoodFilterTag
  );

  if (tracks.length === 0) {
    showAppToast('Chưa có bài hát phù hợp với Mood này.');
    return;
  }

  // Tạo Queue mới chỉ gồm các bài phù hợp.
  const queue = shuffle
    ? shuffleArray(tracks)
    : [...tracks];

  state.playbackQueue = queue;
  state.queuePosition = 0;

  // Phát bài đầu tiên trong Queue.
  playSong(state.playbackQueue[0]);

  // Cập nhật giao diện danh sách chờ.
  buildQueuePanel();
  buildUpNext();

  showAppToast(
    `Đang phát: ${mood.name} (${queue.length} bài hát)`
  );
}


function saveMoodToPlaylist(moodId) {
  const mood = moodDefinitions.find(m => m.id === moodId) || moodDefinitions[0];
  const tracks = getMoodTrackIndices(moodId, 'Tất cả');
  const playlistName = `Tâm trạng: ${mood.name}`;
  const playlist = {
    id: `mood-playlist-${Date.now()}`,
    name: playlistName,
    tracks: [...tracks],
    cover: songs[tracks[0] || 0]?.img || 'album_lumina.jpg',
    custom: true,
  };
  userPlaylists.push(playlist);
  persistUserPlaylists();
  renderPlaylistCollections();
  showAppToast(`Đã lưu danh sách “${playlistName}” vào Thư viện.`);
}

function refreshMoodRecommendations(moodId) {
  const currentOffset = moodShuffleOffsets.get(moodId) || 0;
  moodShuffleOffsets.set(moodId, currentOffset + 1);
  renderMoodRecommendations(moodId, activeMoodFilterTag);
  const mood = moodDefinitions.find(m => m.id === moodId);
  showAppToast(`Đã làm mới đề xuất cho “${mood?.name || 'Tâm trạng'}”.`);
}

function filterMoodTracks(tag) {
  activeMoodFilterTag = tag;
  renderMoodRecommendations(activeMoodId, tag);
}

function renderHomeMoodSelector() {
  const container = document.getElementById('home-mood-cards');
  if (!container) return;
  container.replaceChildren();

  moodDefinitions.forEach(mood => {
    const isSelected = mood.id === activeMoodId;
    const card = document.createElement('div');
    card.className = `mood-card ${isSelected ? 'active' : ''}`;
    card.dataset.moodId = mood.id;
    card.setAttribute('role', 'radio');
    card.setAttribute('aria-checked', String(isSelected));
    card.setAttribute('tabindex', '0');
    card.style.setProperty('--mood-gradient', mood.gradient);
    card.style.setProperty('--mood-accent', mood.accent);
    card.style.setProperty('--mood-glow', mood.glow);

    card.innerHTML = `
      <div class="mood-card-aura" aria-hidden="true"></div>
      <div class="mood-card-top">
        <div class="mood-card-icon-wrap" style="color: ${mood.accent}">
          ${mood.iconSvg}
        </div>
        <span class="mood-card-badge">${mood.badge}</span>
      </div>
      <div class="mood-card-body">
        <h3 class="mood-card-title">${mood.name}</h3>
        <p class="mood-card-tagline">${mood.tagline}</p>
      </div>
      <div class="mood-card-footer">
        <span class="mood-card-selected-tag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
          Đang chọn
        </span>
        <button class="mood-card-play-btn" type="button" aria-label="Phát ngay tâm trạng ${mood.name}" title="Phát ngay">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
    `;

    card.addEventListener('click', () => {
      setActiveMood(mood.id, false);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActiveMood(mood.id, false);
      }
    });

    const playBtn = card.querySelector('.mood-card-play-btn');
    if (playBtn) {
      playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveMood(mood.id, false);
        playMoodTracks(mood.id, false);
      });
    }

    container.appendChild(card);
  });
}

function renderMoodRecommendations(moodId, filterTag = activeMoodFilterTag) {
  const panel = document.getElementById('mood-recommendations-panel');
  if (!panel) return;
  const mood = moodDefinitions.find(m => m.id === moodId) || moodDefinitions[0];
  const tracks = getMoodTrackIndices(moodId, filterTag);
  const totalSeconds = tracks.reduce((acc, idx) => acc + (songs[idx]?.duration || 0), 0);
  const totalMin = Math.round(totalSeconds / 60);

  panel.style.setProperty('--active-mood-accent', mood.accent);
  panel.style.setProperty('--active-mood-gradient', mood.gradient);
  panel.style.setProperty('--active-mood-glow', mood.glow);

  panel.innerHTML = `
    <div class="mood-rec-backdrop" aria-hidden="true"></div>
    <div class="mood-rec-header">
      <div class="mood-rec-art" style="background: ${mood.gradient}; box-shadow: 0 10px 30px ${mood.glow};">
        <div class="mood-rec-art-icon" style="color: #fff;">${mood.iconSvg}</div>
        <span class="mood-rec-art-emoji">${mood.emoji}</span>
      </div>
      <div class="mood-rec-info">
        <div class="mood-rec-eyebrow">
          <span class="mood-sparkle">✨</span>
          <span>DANH SÁCH ĐỀ XUẤT CHO TÂM TRẠNG</span>
          <span class="mood-badge-vibe">${mood.badge}</span>
        </div>
        <h2 class="mood-rec-title">Giai Điệu ${mood.name}</h2>
        <p class="mood-rec-desc">${mood.description}</p>
        <div class="mood-rec-meta">
          <span class="meta-item"><strong>${tracks.length}</strong> bài hát</span>
          <span class="meta-dot">·</span>
          <span class="meta-item">khoảng <strong>${totalMin} phút</strong></span>
          <span class="meta-dot">·</span>
          <span class="meta-item match-score"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Độ khớp cảm xúc 99%</span>
        </div>
      </div>
      <div class="mood-rec-actions">
        <button class="mood-action-btn primary" type="button" onclick="playMoodTracks('${mood.id}', false)">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          <span>Phát tất cả</span>
        </button>
        <button class="mood-action-btn secondary" type="button" onclick="playMoodTracks('${mood.id}', true)" title="Phát ngẫu nhiên">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
          <span>Trộn bài</span>
        </button>
        <button class="mood-action-btn secondary" type="button" onclick="saveMoodToPlaylist('${mood.id}')" title="Lưu danh sách đề xuất này">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          <span>Lưu playlist</span>
        </button>
        <button class="mood-action-btn ghost" type="button" onclick="refreshMoodRecommendations('${mood.id}')" title="Đề xuất các bài hát khác">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
          <span>Đổi đề xuất</span>
        </button>
      </div>
    </div>

    <!-- Sub filter tags -->
    <div class="mood-filter-tags-bar" role="tablist" aria-label="Bộ lọc con của tâm trạng">
      ${mood.tags.map(tag => `
        <button class="mood-filter-pill ${tag === filterTag ? 'active' : ''}" type="button" onclick="filterMoodTracks('${tag}')">
          ${tag === 'Tất cả' ? '🎵 ' + tag : tag}
        </button>
      `).join('')}
    </div>

    <!-- Tracklist Table -->
    <div class="mood-track-table">
      <div class="mood-table-head">
        <span class="col-num">#</span>
        <span class="col-title">Tiêu đề bài hát</span>
        <span class="col-album">Album</span>
        <span class="col-vibe">Gắn thẻ</span>
        <span class="col-dur">◷ Thời lượng</span>
        <span class="col-actions">Thao tác</span>
      </div>
      <div class="mood-track-list" id="mood-track-rows"></div>
    </div>
  `;

  const rowsContainer = panel.querySelector('#mood-track-rows');
  tracks.forEach((songIdx, position) => {
    const song = songs[songIdx];
    if (!song) return;
    const isPlayingThis = songIdx === state.currentSong && state.isPlaying;
    const isLiked = state.likedSongs.has(songIdx);
    const row = document.createElement('div');
    row.className = `track-item mood-track-row ${songIdx === state.currentSong ? 'playing' : ''}`;
    row.dataset.songIndex = String(songIdx);
    row.setAttribute('role', 'button');
    row.setAttribute('tabindex', '0');
    row.setAttribute('aria-label', `Phát bài ${song.title} của ${song.artist}`);

    row.innerHTML = `
      <div class="col-num">
        <span class="mood-track-num ${isPlayingThis ? 'hidden' : ''}">${position + 1}</span>
        <div class="mood-track-eq ${isPlayingThis ? '' : 'hidden'}" aria-label="Đang phát">
          <span></span><span></span><span></span>
        </div>
        <button class="mood-row-play-btn" type="button" aria-label="Phát"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
      </div>
      <div class="col-title-area">
        <img class="track-thumb" src="${song.img}" alt="${song.title}"/>
        <div class="track-details">
          <p class="track-name">${song.title}</p>
          <p class="track-artist">${song.artist}</p>
        </div>
      </div>
      <div class="col-album">${song.album}</div>
      <div class="col-vibe">
        <span class="mood-tag-chip" style="color: ${mood.accent}; border-color: ${mood.accent}33; background: ${mood.accent}14">
          ${song.tags?.[0] || '#' + mood.name.split(' ')[0]}
        </span>
      </div>
      <div class="col-dur">${formatTime(song.duration)}</div>
      <div class="col-actions" onclick="event.stopPropagation()">
        <button class="mood-like-btn ${isLiked ? 'liked' : ''}" data-song-index="${songIdx}" type="button" onclick="toggleLike(event, ${songIdx})" aria-label="Yêu thích">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/></svg>
        </button>
        <button class="mood-queue-btn" type="button" onclick="addToQueue(event, ${songIdx})" aria-label="Thêm vào hàng chờ" title="Thêm vào danh sách chờ">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
    `;

    row.addEventListener('click', () => {
      playSong(songIdx);
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playSong(songIdx);
      }
    });

    rowsContainer.appendChild(row);
  });
}

function renderMoodView() {
  const container = document.getElementById('view-mood-content');
  if (!container) return;
  const activeMood = moodDefinitions.find(m => m.id === activeMoodId) || moodDefinitions[0];

  container.innerHTML = `
    <!-- Mood Hub Hero -->
    <section class="mood-view-hero" style="background: linear-gradient(180deg, ${activeMood.accent}22 0%, transparent 100%)">
      <div class="mood-view-hero-content">
        <span class="mood-section-badge">Khám phá tâm trạng</span>
        <h1>Âm Nhạc Theo Cảm Xúc Của Bạn</h1>
        <p>Bất kể tâm trạng của bạn hôm nay ra sao — thư thái, cháy hết mình trong phòng tập hay cần tập trung cao độ — SpotiSix luôn có playlist hoàn hảo dành cho bạn.</p>
        
        <!-- Mood Quick Category Filter -->
        <div class="mood-hub-pills">
          ${moodDefinitions.map(m => `
            <button class="mood-hub-pill ${m.id === activeMoodId ? 'active' : ''}" style="${m.id === activeMoodId ? `border-color: ${m.accent}; background: ${m.accent}22; color: #fff;` : ''}" onclick="setActiveMood('${m.id}', true)">
              <span>${m.emoji}</span>
              <strong>${m.name}</strong>
            </button>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- All Moods Grid -->
    <section class="mood-grid-section">
      <div class="section-title-row">
        <div>
          <h2>Chọn tâm trạng của bạn</h2>
          <p class="section-subtitle">Chạm vào bất kỳ thẻ tâm trạng nào để cập nhật danh sách đề xuất ngay lập tức</p>
        </div>
      </div>
      <div class="mood-cards-grid">
        ${moodDefinitions.map(mood => {
          const isSelected = mood.id === activeMoodId;
          return `
            <div class="mood-card ${isSelected ? 'active' : ''}" data-mood-id="${mood.id}" tabindex="0" onclick="setActiveMood('${mood.id}', true)" style="--mood-gradient: ${mood.gradient}; --mood-accent: ${mood.accent}; --mood-glow: ${mood.glow};">
              <div class="mood-card-aura" aria-hidden="true"></div>
              <div class="mood-card-top">
                <div class="mood-card-icon-wrap" style="color: ${mood.accent}">${mood.iconSvg}</div>
                <span class="mood-card-badge">${mood.badge}</span>
              </div>
              <div class="mood-card-body">
                <h3 class="mood-card-title">${mood.name}</h3>
                <p class="mood-card-tagline">${mood.tagline}</p>
              </div>
              <div class="mood-card-footer">
                <span class="mood-card-selected-tag">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                  Đang chọn
                </span>
                <button class="mood-card-play-btn" type="button" aria-label="Phát ngay" onclick="event.stopPropagation(); setActiveMood('${mood.id}', true); playMoodTracks('${mood.id}', false)">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- Detailed Recommendations in Mood Hub -->
    <section class="mood-hub-rec-section">
      <div id="mood-hub-recommendations-panel" class="mood-recommendations-panel">
        <!-- Rendered below -->
      </div>
    </section>
  `;

  const hubPanel = container.querySelector('#mood-hub-recommendations-panel');
  if (hubPanel) {
    const tracks = getMoodTrackIndices(activeMoodId, activeMoodFilterTag);
    const totalSeconds = tracks.reduce((acc, idx) => acc + (songs[idx]?.duration || 0), 0);
    const totalMin = Math.round(totalSeconds / 60);

    hubPanel.style.setProperty('--active-mood-accent', activeMood.accent);
    hubPanel.style.setProperty('--active-mood-gradient', activeMood.gradient);
    hubPanel.style.setProperty('--active-mood-glow', activeMood.glow);

    hubPanel.innerHTML = `
      <div class="mood-rec-backdrop" aria-hidden="true"></div>
      <div class="mood-rec-header">
        <div class="mood-rec-art" style="background: ${activeMood.gradient}; box-shadow: 0 10px 30px ${activeMood.glow};">
          <div class="mood-rec-art-icon" style="color: #fff;">${activeMood.iconSvg}</div>
          <span class="mood-rec-art-emoji">${activeMood.emoji}</span>
        </div>
        <div class="mood-rec-info">
          <div class="mood-rec-eyebrow">
            <span class="mood-sparkle">✨</span>
            <span>DANH SÁCH ĐỀ XUẤT CHO TÂM TRẠNG</span>
            <span class="mood-badge-vibe">${activeMood.badge}</span>
          </div>
          <h2 class="mood-rec-title">Giai Điệu ${activeMood.name}</h2>
          <p class="mood-rec-desc">${activeMood.description}</p>
          <div class="mood-rec-meta">
            <span class="meta-item"><strong>${tracks.length}</strong> bài hát</span>
            <span class="meta-dot">·</span>
            <span class="meta-item">khoảng <strong>${totalMin} phút</strong></span>
            <span class="meta-dot">·</span>
            <span class="meta-item match-score"><svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> Độ khớp cảm xúc 99%</span>
          </div>
        </div>
        <div class="mood-rec-actions">
          <button class="mood-action-btn primary" type="button" onclick="playMoodTracks('${activeMood.id}', false)">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            <span>Phát tất cả</span>
          </button>
          <button class="mood-action-btn secondary" type="button" onclick="playMoodTracks('${activeMood.id}', true)">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10.59 9.17 5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/></svg>
            <span>Trộn bài</span>
          </button>
          <button class="mood-action-btn secondary" type="button" onclick="saveMoodToPlaylist('${activeMood.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            <span>Lưu playlist</span>
          </button>
          <button class="mood-action-btn ghost" type="button" onclick="refreshMoodRecommendations('${activeMood.id}')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>Đổi đề xuất</span>
          </button>
        </div>
      </div>
      <div class="mood-track-table">
        <div class="mood-table-head">
          <span class="col-num">#</span>
          <span class="col-title">Tiêu đề bài hát</span>
          <span class="col-album">Album</span>
          <span class="col-vibe">Gắn thẻ</span>
          <span class="col-dur">◷ Thời lượng</span>
          <span class="col-actions">Thao tác</span>
        </div>
        <div class="mood-track-list">
          ${tracks.map((songIdx, position) => {
            const song = songs[songIdx];
            if (!song) return '';
            const isPlayingThis = songIdx === state.currentSong && state.isPlaying;
            const isLiked = state.likedSongs.has(songIdx);
            return `
              <div class="track-item mood-track-row ${songIdx === state.currentSong ? 'playing' : ''}" data-song-index="${songIdx}" onclick="playSong(${songIdx})">
                <div class="col-num">
                  <span class="mood-track-num ${isPlayingThis ? 'hidden' : ''}">${position + 1}</span>
                  <div class="mood-track-eq ${isPlayingThis ? '' : 'hidden'}" aria-label="Đang phát"><span></span><span></span><span></span></div>
                  <button class="mood-row-play-btn" type="button" aria-label="Phát"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></button>
                </div>
                <div class="col-title-area">
                  <img class="track-thumb" src="${song.img}" alt="${song.title}"/>
                  <div class="track-details">
                    <p class="track-name">${song.title}</p>
                    <p class="track-artist">${song.artist}</p>
                  </div>
                </div>
                <div class="col-album">${song.album}</div>
                <div class="col-vibe">
                  <span class="mood-tag-chip" style="color: ${activeMood.accent}; border-color: ${activeMood.accent}33; background: ${activeMood.accent}14">
                    ${song.tags?.[0] || '#' + activeMood.name.split(' ')[0]}
                  </span>
                </div>
                <div class="col-dur">${formatTime(song.duration)}</div>
                <div class="col-actions" onclick="event.stopPropagation()">
                  <button class="mood-like-btn ${isLiked ? 'liked' : ''}" data-song-index="${songIdx}" type="button" onclick="toggleLike(event, ${songIdx})" aria-label="Yêu thích">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/></svg>
                  </button>
                  <button class="mood-queue-btn" type="button" onclick="addToQueue(event, ${songIdx})" aria-label="Thêm vào hàng chờ">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

function initializePlaylistFeatures() {
  try {
    const storedPlaylists = JSON.parse(localStorage.getItem(playlistStorageKey) || '[]');
    if (Array.isArray(storedPlaylists)) {
      userPlaylists = storedPlaylists
        .filter(item => item && typeof item.id === 'string' && typeof item.name === 'string' && Array.isArray(item.tracks))
        .map(item => ({
          id: item.id,
          name: item.name.trim().slice(0, 40),
          tracks: item.tracks.filter(index => Number.isInteger(index) && index >= 0 && index < songs.length),
          cover: typeof item.cover === 'string' ? item.cover : 'album_lumina.jpg',
          custom: true,
        }))
        .filter(item => item.name);
    }
    const liked = JSON.parse(localStorage.getItem(likedSongsStorageKey) || '[3]');
    if (Array.isArray(liked)) {
      state.likedSongs = new Set(liked.filter(index => Number.isInteger(index) && index >= 0 && index < songs.length));
    }
  } catch (error) {
    console.error('Không thể đọc playlist hoặc bài hát yêu thích đã lưu.', error);
  }
  const selected = [...defaultPlaylists, ...userPlaylists].find(playlist => playlist.id === activePlaylistId);
  state.playbackQueue = [...(selected?.tracks || defaultPlaylists[0].tracks)];
  document.body.classList.remove('playlist-mode');
  document.body.classList.add('home-dashboard');
  const sortLabel = document.querySelector('.playlist-sort-control span');
  if (sortLabel) {
    sortLabel.id = 'playlist-sort-button';
    sortLabel.classList.add('playlist-sort-button');
    sortLabel.setAttribute('role', 'button');
    sortLabel.tabIndex = 0;
    sortLabel.setAttribute('aria-label', 'Sắp xếp bài hát trong playlist');
    sortLabel.addEventListener('click', sortActivePlaylist);
    sortLabel.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        sortActivePlaylist();
      }
    });
  }
  document.querySelectorAll('.library-filter').forEach((button, index) => {
    button.addEventListener('click', () => switchLibTab(['playlists', 'albums', 'artists', 'songs'][index] || 'playlists'));
  });
  document.querySelector('.library-sort button:first-child').addEventListener('click', () => {
    switchLibTab('songs');
    toggleLibrarySearch();
  });
  renderPlaylistCollections();
  renderActivePlaylist();
  renderLocalLibraryTracks();
}

function allPlaylists() {
  return [...defaultPlaylists, ...userPlaylists];
}

function persistUserPlaylists() {
  localStorage.setItem(playlistStorageKey, JSON.stringify(userPlaylists.filter(playlist => !playlist.temporary)));
}

function renderPlaylistCollections() {
  const sidebar = document.getElementById('sidebar-playlists');
  sidebar.replaceChildren();
  allPlaylists().forEach((playlist, position) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `playlist-item${playlist.id === activePlaylistId ? ' active-playlist' : ''}`;
    button.dataset.playlistId = playlist.id;
    button.dataset.playlistName = playlist.name.toLowerCase();
    button.addEventListener('click', () => openPlaylist(playlist.id));
    const cover = document.createElement('img');
    cover.className = 'playlist-thumb';
    cover.src = playlist.cover;
    cover.alt = '';
    const info = document.createElement('span');
    info.className = 'playlist-info';
    const title = document.createElement('span');
    title.className = 'playlist-name';
    title.textContent = playlist.name;
    const subtitle = document.createElement('span');
    subtitle.className = 'playlist-meta';
    subtitle.textContent = `Danh sách phát · ${playlist.tracks.length} bài`;
    info.append(title, subtitle);
    button.append(cover, info);
    sidebar.append(button);
  });

  const libraryGrid = document.querySelector('#lib-playlists .lib-grid');
  if (libraryGrid) {
    libraryGrid.replaceChildren();
    allPlaylists().forEach(playlist => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'lib-card';
      card.addEventListener('click', () => openPlaylist(playlist.id));
      const cover = document.createElement('img');
      cover.className = 'lib-card-img';
      cover.src = playlist.cover;
      cover.alt = '';
      const title = document.createElement('span');
      title.className = 'lib-card-name';
      title.textContent = playlist.name;
      const subtitle = document.createElement('span');
      subtitle.className = 'lib-card-sub';
      subtitle.textContent = `Playlist · ${playlist.tracks.length} bài`;
      card.append(cover, title, subtitle);
      libraryGrid.append(card);
    });
  }
  renderProfileCollections();
}

function renderProfileCollections() {
  const stats = document.querySelectorAll('.profile-stats > div strong');
  if (stats[0]) stats[0].textContent = String(allPlaylists().length);
  if (stats[1]) stats[1].textContent = String(followedArtists.size);

  const followedList = document.querySelector('.profile-followed-artists');
  if (followedList) {
    followedList.replaceChildren();
    document.querySelectorAll('#lib-artists .artist-row').forEach(row => {
      const name = row.querySelector('.artist-name').textContent;
      if (!followedArtists.has(name)) return;
      const article = document.createElement('article');
      const image = document.createElement('img');
      image.src = row.querySelector('.artist-avatar').src;
      image.alt = name;
      const title = document.createElement('span');
      title.textContent = name;
      const label = document.createElement('small');
      label.textContent = 'Nghệ sĩ';
      article.append(image, title, label);
      followedList.append(article);
    });
  }

  const profilePlaylists = document.querySelector('.profile-playlists');
  if (profilePlaylists) {
    profilePlaylists.replaceChildren();
    allPlaylists().forEach(playlist => {
      const button = document.createElement('button');
      button.type = 'button';
      button.addEventListener('click', () => {
        openPlaylist(playlist.id);
        playActivePlaylist();
      });
      const name = document.createElement('span');
      name.textContent = playlist.name;
      const count = document.createElement('span');
      count.textContent = `${playlist.tracks.length} bài`;
      button.append(name, count);
      profilePlaylists.append(button);
    });
  }
}

function updateArtistFollowButtons() {
  document.querySelectorAll('#lib-artists .artist-row').forEach(row => {
    const name = row.querySelector('.artist-name').textContent;
    const button = row.querySelector('.follow-btn');
    const isFollowing = followedArtists.has(name);
    button.classList.toggle('following', isFollowing);
    button.textContent = isFollowing ? 'Đang theo dõi' : 'Theo dõi';
    button.setAttribute('aria-pressed', String(isFollowing));
  });
}

function toggleArtistFollow(button) {
  const name = button.closest('.artist-row').querySelector('.artist-name').textContent;
  if (followedArtists.has(name)) {
    followedArtists.delete(name);
  } else {
    followedArtists.add(name);
  }
  localStorage.setItem(followedArtistsStorageKey, JSON.stringify([...followedArtists]));
  updateArtistFollowButtons();
  renderProfileCollections();
}

function activePlaylist() {
  return allPlaylists().find(playlist => playlist.id === activePlaylistId) || defaultPlaylists[0];
}

function openPlaylist(id) {
  const playlist = allPlaylists().find(item => item.id === id);
  if (!playlist) return;
  showView('home');
  activePlaylistId = playlist.id;
  state.playbackQueue = [...playlist.tracks];
  state.queuePosition = 0;
  playlistSortMode = 'custom';
  activeTrackOrder = null;
  document.body.classList.add('playlist-mode');
  document.body.classList.remove('home-dashboard');
  document.querySelectorAll('.playlist-item').forEach(item => {
    item.classList.toggle('active-playlist', item.dataset.playlistId === playlist.id);
  });
  document.querySelectorAll('.playlist-sort-control').forEach(control => {
    control.classList.remove('sort-ascending');
  });
  const sortButton = document.getElementById('playlist-sort-button');
  if (sortButton) sortButton.textContent = 'Thứ tự tùy chỉnh';
  renderActivePlaylist();
  buildQueuePanel();
}

function renderActivePlaylist() {
  const playlist = activePlaylist();
  const tracks = activeTrackOrder || playlist.tracks;
  document.getElementById('playlist-heading').textContent = playlist.name;
  document.querySelectorAll('.playlist-cover-collage img').forEach((image, index) => {
    const songIndex = tracks[index % Math.max(tracks.length, 1)];
    image.src = tracks.length ? songs[songIndex].img : playlist.cover;
  });
  document.getElementById('playlist-track-rows').replaceChildren();
  const count = tracks.length;
  const totalSeconds = tracks.reduce((total, index) => total + songs[index].duration, 0);
  const owner = document.querySelector('.playlist-owner');
  owner.replaceChildren();
  const avatar = document.createElement('span');
  avatar.className = 'owner-avatar';
  avatar.textContent = 'S';
  const ownerName = document.createElement('strong');
  ownerName.textContent = 'SpotiSix';
  const separator = document.createElement('span');
  separator.textContent = '·';
  owner.append(avatar, ownerName, separator, document.createTextNode(` ${count} bài hát, ${Math.floor(totalSeconds / 60)} phút`));
  tracks.forEach((songIndex, position) => {
    const song = songs[songIndex];
    const row = document.createElement('div');
    row.className = 'track-item';
    row.id = `playlist-track-${position}`;
    row.tabIndex = 0;
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', `Phát ${song.title} của ${song.artist}`);
    row.addEventListener('click', () => playSong(songIndex));
    row.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        playSong(songIndex);
      }
    });

    const number = document.createElement('span');
    number.className = 'track-num';
    number.textContent = String(position + 1);
    const cover = document.createElement('img');
    cover.className = 'track-thumb';
    cover.src = song.img;
    cover.alt = '';
    const details = document.createElement('span');
    details.className = 'track-details';
    const title = document.createElement('span');
    title.className = 'track-name';
    title.textContent = song.title;
    const artist = document.createElement('span');
    artist.className = 'track-artist';
    artist.textContent = song.artist;
    details.append(title, artist);
    const album = document.createElement('span');
    album.className = 'playlist-album';
    album.textContent = song.album;
    const date = document.createElement('span');
    date.className = 'playlist-date';
    date.textContent = 'Thêm gần đây';
    const duration = document.createElement('span');
    duration.className = 'track-duration';
    duration.textContent = formatTime(song.duration);
    const like = document.createElement('button');
    like.type = 'button';
    like.className = `playlist-row-action playlist-row-like${state.likedSongs.has(songIndex) ? ' liked' : ''}`;
    like.setAttribute('aria-label', state.likedSongs.has(songIndex) ? 'Bỏ yêu thích' : 'Thêm vào bài hát yêu thích');
    like.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z"/></svg>';
    like.addEventListener('click', event => toggleLike(event, songIndex));
    const queue = document.createElement('button');
    queue.type = 'button';
    queue.className = 'playlist-row-action playlist-row-queue';
    queue.setAttribute('aria-label', `Thêm ${song.title} vào danh sách chờ`);
    queue.textContent = '+';
    queue.addEventListener('click', event => addToQueue(event, songIndex));
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'playlist-row-action playlist-row-remove';
    remove.setAttribute('aria-label', `Xóa ${song.title} khỏi playlist`);
    remove.textContent = '−';
    remove.disabled = !playlist.custom;
    remove.addEventListener('click', event => removeSongFromPlaylist(event, songIndex));
    row.append(number, cover, details, album, date, duration, like, queue, remove);
    document.getElementById('playlist-track-rows').append(row);
  });
  document.getElementById('playlist-main-play').disabled = count === 0;
  updateTrackHighlight();
}

function openPlaylistDialog() {
  const dialog = document.getElementById('playlist-dialog');
  if (!dialog.open) dialog.showModal();
  document.getElementById('playlist-name-input').focus();
}

function closePlaylistDialog() {
  document.getElementById('playlist-dialog').close();
}

function createPlaylist(event) {
  event.preventDefault();
  const input = document.getElementById('playlist-name-input');
  const name = input.value.trim();
  if (!name) {
    input.setCustomValidity('Nhập tên danh sách phát.');
    input.reportValidity();
    return;
  }
  input.setCustomValidity('');
  const playlist = {
    id: `playlist-${Date.now()}`,
    name,
    tracks: [],
    cover: songs[userPlaylists.length % songs.length].img,
    custom: true,
  };
  userPlaylists.push(playlist);
  persistUserPlaylists();
  renderPlaylistCollections();
  input.value = '';
  closePlaylistDialog();
  openPlaylist(playlist.id);
  showAppToast(`Đã tạo playlist “${name}”. Thêm bài bằng nút + cạnh từng bài hát.`);
}

function addToQueue(event, songIndex) {
  event.stopPropagation();
  const insertAt = Math.min(state.queuePosition + 1, state.playbackQueue.length);
  state.playbackQueue.splice(insertAt, 0, songIndex);
  buildQueuePanel();
  showAppToast(`Đã thêm “${songs[songIndex].title}” vào danh sách chờ.`);
}

function addSongToActivePlaylist(event, songIndex) {
  event.stopPropagation();
  const playlist = activePlaylist();
  if (!playlist.custom) {
    showAppToast('Tạo playlist của riêng bạn rồi chọn playlist đó để lưu bài hát.');
    return;
  }
  if (playlist.tracks.includes(songIndex)) {
    showAppToast('Bài hát này đã có trong playlist.');
    return;
  }
  playlist.tracks.push(songIndex);
  activeTrackOrder = null;
  persistUserPlaylists();
  renderPlaylistCollections();
  renderActivePlaylist();
  showAppToast(`Đã lưu “${songs[songIndex].title}” vào “${playlist.name}”.`);
}

function removeSongFromPlaylist(event, songIndex) {
  event.stopPropagation();
  const playlist = activePlaylist();
  if (!playlist.custom) return;
  const trackPosition = playlist.tracks.indexOf(songIndex);
  if (trackPosition < 0) return;
  playlist.tracks.splice(trackPosition, 1);
  activeTrackOrder = null;
  if (state.currentSong === songIndex) {
    state.playbackQueue = [...playlist.tracks];
    state.queuePosition = 0;
    if (state.playbackQueue.length) {
      playSong(state.playbackQueue[0]);
    } else {
      state.isPlaying = false;
      clearInterval(timerInterval);
      if (audioPlayer) audioPlayer.pause();
      syncPlayIcons();
    }
  } else {
    state.playbackQueue = [...playlist.tracks];
    state.queuePosition = Math.max(0, state.playbackQueue.indexOf(state.currentSong));
  }
  persistUserPlaylists();
  renderPlaylistCollections();
  renderActivePlaylist();
  buildQueuePanel();
  showAppToast(`Đã xóa “${songs[songIndex].title}” khỏi playlist.`);
}

function playActivePlaylist() {
  const playlist = activePlaylist();
  if (!playlist.tracks.length) {
    showAppToast('Playlist đang trống. Tìm bài hát rồi dùng nút + để thêm nhạc.');
    return;
  }
  state.playbackQueue = [...playlist.tracks];
  state.queuePosition = 0;
  playSong(state.playbackQueue[0]);
}

function sortActivePlaylist() {
  const playlist = activePlaylist();
  playlistSortMode = playlistSortMode === 'custom' ? 'title' : 'custom';
  if (playlistSortMode === 'title') {
    activeTrackOrder = [...playlist.tracks].sort((a, b) => songs[a].title.localeCompare(songs[b].title));
    state.playbackQueue = [...activeTrackOrder];
    document.getElementById('playlist-sort-button').textContent = 'Tiêu đề A–Z';
  } else {
    activeTrackOrder = null;
    state.playbackQueue = [...playlist.tracks];
    document.getElementById('playlist-sort-button').textContent = 'Thứ tự tùy chỉnh';
  }
  state.queuePosition = Math.max(0, state.playbackQueue.indexOf(state.currentSong));
  renderActivePlaylist();
  buildQueuePanel();
}

function toggleLibrarySearch() {
  if (!document.getElementById('view-library').classList.contains('active')) showView('library');
  switchLibTab('songs');
  const librarySort = document.querySelector('.library-sort');
  const host = window.matchMedia('(max-width: 800px)').matches
    ? document.querySelector('#view-library .content-scroll')
    : librarySort;
  let input = document.getElementById('library-search-input');
  if (!input) {
    input = document.createElement('input');
    input.id = 'library-search-input';
    input.className = 'library-search-input';
    input.type = 'search';
    input.placeholder = 'Tìm bài hát trong thư viện';
    input.setAttribute('aria-label', 'Tìm bài hát trong thư viện');
    input.addEventListener('input', () => filterLibraryItems(input.value));
  } else {
    input.classList.toggle('hidden');
  }
  if (input.parentElement !== host) host.prepend(input);
  const isOpen = !input.classList.contains('hidden');
  librarySort.classList.toggle('search-open', isOpen);
  if (isOpen) input.focus();
  else filterLibraryItems('');
}

function filterLibraryItems(query) {
  const normalized = query.trim().toLocaleLowerCase();
  librarySearchQuery = normalized;
  document.querySelectorAll('#sidebar-playlists .playlist-item').forEach(item => {
    const playlist = allPlaylists().find(entry => entry.id === item.dataset.playlistId);
    const includesTrack = playlist?.tracks.some(index => {
      const song = songs[index];
      return song && `${song.title} ${song.artist} ${song.album}`.toLocaleLowerCase().includes(normalized);
    });
    item.classList.toggle('hidden', normalized.length > 0 && !item.dataset.playlistName.includes(normalized) && !includesTrack);
  });
  document.querySelectorAll('#lib-songs .track-item').forEach(item => {
    item.classList.toggle('hidden', normalized.length > 0 && !item.dataset.searchText.includes(normalized));
  });
}

function renderLocalLibraryTracks() {
  const container = document.getElementById('spotify-demo-library');
  container.replaceChildren();
  songs.forEach((song, index) => {
    const row = document.createElement('div');
    row.className = 'track-item';
    row.dataset.searchText = `${song.title} ${song.artist} ${song.album}`.toLocaleLowerCase();
    row.addEventListener('click', () => playSong(index));
    const number = document.createElement('span');
    number.className = 'track-num';
    number.textContent = String(index + 1);
    const cover = document.createElement('img');
    cover.className = 'track-thumb';
    cover.src = song.img;
    cover.alt = '';
    const details = document.createElement('div');
    details.className = 'track-details';
    const title = document.createElement('p');
    title.className = 'track-name';
    title.textContent = song.title;
    const artist = document.createElement('p');
    artist.className = 'track-artist';
    artist.textContent = `${song.artist} · ${song.album}`;
    details.append(title, artist);
    const duration = document.createElement('span');
    duration.className = 'track-duration';
    duration.textContent = formatTime(song.duration);
    row.append(number, cover, details, duration);
    container.appendChild(row);
  });
  filterLibraryItems(librarySearchQuery);
}

function showAppToast(message) {
  const toast = document.getElementById('app-toast');
  toast.textContent = message;
  toast.classList.remove('hidden');
  clearTimeout(showAppToast.timeout);
  showAppToast.timeout = setTimeout(() => toast.classList.add('hidden'), 2800);
}

async function importAudioFiles(fileList) {
  const files = Array.from(fileList || []).filter(file => file.type.startsWith('audio/'));
  if (!files.length) {
    showAppToast('Chọn tệp âm thanh hợp lệ để nhập.');
    return;
  }
  const playlist = getDeviceAudioPlaylist();
  let importedCount = 0;
  let database;
  try {
    database = await openDeviceAudioDatabase();
    for (const file of files) {
      const record = {
        id: crypto.randomUUID(),
        title: file.name.replace(/\.[^.]+$/, ''),
        blob: file,
        mimeType: file.type,
        sizeBytes: file.size,
        addedAt: Date.now(),
      };
      await storeDeviceAudio(database, record);
      addDeviceAudioToLibrary(record);
      importedCount++;
    }
    if (!importedCount) return;
    finishDeviceAudioImport(playlist);
    showAppToast(`Đã lưu ${importedCount} bài trên thiết bị này. Nhạc sẽ còn sau khi tải lại trang.`);
  } catch (error) {
    if (importedCount) finishDeviceAudioImport(playlist);
    showAppToast(`Không thể lưu nhạc trên thiết bị: ${error.message || 'Bộ nhớ trình duyệt không khả dụng.'}`);
  } finally {
    database?.close();
  }
}

function openDeviceAudioDatabase() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('Trình duyệt này không hỗ trợ lưu trữ nhạc lâu dài.'));
      return;
    }
    const request = window.indexedDB.open(deviceAudioDatabaseName, 1);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(deviceAudioStoreName)) {
        database.createObjectStore(deviceAudioStoreName, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Không mở được bộ nhớ nhạc trên thiết bị.'));
    request.onblocked = () => reject(new Error('Đang có thẻ SpotiSix khác giữ bộ nhớ mở. Hãy tải lại thẻ đó rồi thử lại.'));
  });
}

function storeDeviceAudio(database, record) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(deviceAudioStoreName, 'readwrite');
    transaction.objectStore(deviceAudioStoreName).put(record);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error || new Error('Không thể ghi tệp nhạc vào bộ nhớ trình duyệt.'));
    transaction.onabort = () => reject(transaction.error || new Error('Đã hủy lưu tệp nhạc.'));
  });
}

function loadDeviceAudio(database) {
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(deviceAudioStoreName, 'readonly');
    const request = transaction.objectStore(deviceAudioStoreName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Không thể đọc thư viện nhạc đã lưu.'));
    transaction.onabort = () => reject(transaction.error || new Error('Đã hủy đọc thư viện nhạc.'));
  });
}

async function restoreDeviceAudio() {
  const database = await openDeviceAudioDatabase();
  try {
    const records = await loadDeviceAudio(database);
    if (!records.length) return;
    records.sort((a, b) => a.addedAt - b.addedAt);
    records.forEach(addDeviceAudioToLibrary);
    getDeviceAudioPlaylist();
    renderPlaylistCollections();
    renderLocalLibraryTracks();
  } finally {
    database.close();
  }
}

function getDeviceAudioPlaylist() {
  let playlist = userPlaylists.find(item => item.id === 'device-audio');
  if (!playlist) {
    playlist = { id: 'device-audio', name: 'Nhạc trên thiết bị', tracks: [], cover: 'album_lumina.jpg', custom: true, temporary: true };
    userPlaylists.push(playlist);
  }
  return playlist;
}

function addDeviceAudioToLibrary(record) {
  const existingIndex = songs.findIndex(song => song.localAudioId === record.id);
  if (existingIndex >= 0) return existingIndex;
  const playlist = getDeviceAudioPlaylist();
  const songIndex = songs.push({
    title: record.title,
    artist: 'Tệp trên thiết bị',
    album: 'Thư viện cục bộ',
    duration: 0,
    img: 'album_lumina.jpg',
    audioSrc: URL.createObjectURL(record.blob),
    localAudioId: record.id,
  }) - 1;
  playlist.tracks.push(songIndex);
  return songIndex;
}

function finishDeviceAudioImport(playlist) {
  renderLocalLibraryTracks();
  activePlaylistId = playlist.id;
  state.playbackQueue = [...playlist.tracks];
  state.queuePosition = playlist.tracks.length - 1;
  renderPlaylistCollections();
  openPlaylist(playlist.id);
  if (state.playbackQueue.length) playSong(state.playbackQueue[state.queuePosition]);
}

async function publishAudioFiles(fileList) {
  const files = Array.from(fileList || []);
  const uploadStatus = document.getElementById('community-upload-status');
  const setUploadStatus = (message, isError = false) => {
    uploadStatus.textContent = message;
    uploadStatus.classList.toggle('is-error', isError);
  };
  if (!supabaseClient) {
    const message = 'Không thể đăng nhạc: Supabase chưa được cấu hình.';
    setUploadStatus(message, true);
    showAppToast(message);
    return;
  }
  const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
  if (sessionError) {
    const message = `Không thể xác minh tài khoản: ${sessionError.message}`;
    setUploadStatus(message, true);
    showAppToast(message);
    return;
  }
  if (!session?.user) {
    const message = 'Bạn chưa đăng nhập. Hãy đăng nhập SpotiSix rồi chọn Đăng nhạc lên SpotiSix lần nữa.';
    setUploadStatus(message, true);
    showAppToast(message);
    return;
  }
  const validFiles = files.filter(file => file.type.startsWith('audio/'));
  if (!validFiles.length) {
    const message = 'Chọn tệp âm thanh hợp lệ để đăng.';
    setUploadStatus(message, true);
    showAppToast(message);
    return;
  }

  const uploadButton = document.getElementById('community-audio-upload-btn');
  if (uploadButton) uploadButton.disabled = true;
  setUploadStatus('Đang tải nhạc lên thư viện công khai…');
  try {
    for (const file of validFiles) {
      if (file.size > 52428800) {
        throw new Error(`${file.name} vượt quá giới hạn 50 MB.`);
      }
      const safeName = file.name.replace(/[^\w.-]+/g, '-').replace(/^-+|-+$/g, '') || 'audio';
      const objectPath = `${session.user.id}/${crypto.randomUUID()}-${safeName}`;
      const { error: uploadError } = await supabaseClient.storage
        .from('community-music')
        .upload(objectPath, file, { contentType: file.type, cacheControl: '3600', upsert: false });
      if (uploadError) throw new Error(`Không thể tải ${file.name} lên: ${uploadError.message}`);

      const title = file.name.replace(/\.[^.]+$/, '').trim() || file.name;
      const searchText = normalizeSearchText(`${title} ${session.user.user_metadata?.display_name || ''}`);
      const { data: track, error: insertError } = await supabaseClient
        .from('published_tracks')
        .insert({
            uploader_id: session.user.id,
            title,
            artist: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Người dùng SpotiSix',
            album: 'Thư viện SpotiSix',
            search_text: searchText,
            object_path: objectPath,
            mime_type: file.type,
            size_bytes: file.size,

            mood: document.getElementById('community-mood')?.value || null,
            activity: document.getElementById('community-activity')?.value || null,
          }
        )

        .select('id, title, artist, album, object_path, mood, activity, created_at')
        .single();
      if (insertError) {
        const { error: cleanupError } = await supabaseClient.storage.from('community-music').remove([objectPath]);
        if (cleanupError) console.error('Could not remove an audio upload after its metadata insert failed.', cleanupError);
        throw new Error(`Không thể thêm ${file.name} vào thư viện trực tuyến: ${insertError.message}`);
      }
      addPublishedTrackToPlayer(track);
    }
    renderLocalLibraryTracks();
    const message = `Đã đăng ${validFiles.length} bài lên thư viện SpotiSix cho mọi người.`;
    setUploadStatus(message);
    showAppToast(message);
    const query = document.getElementById('search-input').value.trim();
    if (query) handleSearch(query);
  } catch (error) {
    const message = error.message || 'Không thể đăng nhạc lên SpotiSix.';
    setUploadStatus(message, true);
    showAppToast(message);
  } finally {
    if (uploadButton) uploadButton.disabled = false;
  }
}

function addPublishedTrackToPlayer(track) {
  if (publishedTrackIndexes.has(track.id)) return publishedTrackIndexes.get(track.id);
  const { data } = supabaseClient.storage.from('community-music').getPublicUrl(track.object_path);
  const index = songs.push({
    title: track.title,
    artist: track.artist,
    album: track.album,
    duration: 0,
    img: 'album_lumina.jpg',
    audioSrc: data.publicUrl,
    // Mood của bài đăng công khai được lưu trong Supabase ở cột `mood`
    // (một giá trị đơn), còn bộ lọc Mood của trình phát dùng mảng `moods`.
    mood: track.mood || null,
    moods: track.mood ? [String(track.mood).trim().toLowerCase() === 'bad' ? 'sad' : String(track.mood).trim().toLowerCase()] : [],
    tags: [],
    publishedTrackId: track.id,
  }) - 1;
  publishedTrackIndexes.set(track.id, index);
  return index;
}

function showHome() {
  showView('home');
}

function showDiscover() {
  const input = document.getElementById('search-input');
  input.value = '';
  handleSearch('');
  showView('search');
}

function manageActivePlaylist() {
  const playlist = activePlaylist();
  if (!playlist.custom || playlist.temporary) {
    showAppToast('Playlist mẫu và thư viện thiết bị không thể đổi tên hoặc xóa.');
    return;
  }
  const action = window.prompt('Nhập tên mới cho playlist, hoặc nhập XÓA để xóa playlist.', playlist.name);
  if (action === null) return;
  if (action.trim().toLocaleLowerCase() === 'xóa') {
    if (!window.confirm(`Xóa playlist “${playlist.name}”?`)) return;
    userPlaylists = userPlaylists.filter(item => item.id !== playlist.id);
    activePlaylistId = defaultPlaylists[0].id;
    persistUserPlaylists();
    renderPlaylistCollections();
    openPlaylist(activePlaylistId);
    showAppToast('Đã xóa playlist.');
    return;
  }
  const name = action.trim().slice(0, 40);
  if (!name) {
    showAppToast('Tên playlist không được để trống.');
    return;
  }
  playlist.name = name;
  persistUserPlaylists();
  renderPlaylistCollections();
  renderActivePlaylist();
  showAppToast(`Đã đổi tên playlist thành “${name}”.`);
}

function downloadActivePlaylist() {
  const tracks = activePlaylist().tracks;
  const localFiles = tracks.map(index => songs[index]).filter(song => song?.audioSrc);
  if (!localFiles.length) {
    showAppToast('Playlist mẫu không có tệp nhạc để tải. Bạn có thể phát tệp cá nhân đã nhập trên thiết bị.');
    return;
  }
  localFiles.forEach(song => {
    const link = document.createElement('a');
    link.href = song.audioSrc;
    link.download = `${song.title}.audio`;
    link.click();
  });
  showAppToast(`Đã tải ${localFiles.length} tệp nhạc cá nhân.`);
}

function shareActivePlaylist() {
  showAppToast('Chia sẻ đồng bộ cần backend; playlist hiện được lưu cục bộ trong trình duyệt này.');
}

function focusHeaderSearch() {
  document.querySelector('.header-search input').focus();
}

// ─── Authentication ──────────────────────────────────────────────
async function initializeAuth() {
  setAuthSession(null);
  const config = window.SPOTISIX_SUPABASE_CONFIG;
  const setupNote = document.getElementById('auth-setup-note');
  if (!config?.url || !config?.anonKey) {
    setupNote.classList.remove('hidden');
    return;
  }

  let projectUrl;
  try {
    projectUrl = new URL(config.url);
  } catch {
    setupNote.classList.remove('hidden');
    setAuthStatus('Project URL không hợp lệ. Hãy sao chép Project URL trong phần Project Settings → API của Supabase.', true);
    return;
  }
  if (!['https:', 'http:'].includes(projectUrl.protocol) ||
      projectUrl.hostname === 'supabase.com' ||
      projectUrl.hostname === 'www.supabase.com' ||
      projectUrl.hostname === 'dashboard.supabase.com') {
    setupNote.classList.remove('hidden');
    setAuthStatus('URL hiện tại là trang Supabase, không phải URL của project. Hãy dùng Project URL dạng https://<project-ref>.supabase.co trong Project Settings → API.', true);
    return;
  }
  const projectRef = projectUrl.hostname.split('.')[0];
  const urlPath = projectUrl.pathname.split('/').filter(Boolean);
  if (urlPath.length === 1 && urlPath[0] === projectRef) {
    projectUrl.pathname = '';
    projectUrl.search = '';
    projectUrl.hash = '';
  } else if (urlPath.length > 0) {
    setupNote.classList.remove('hidden');
    setAuthStatus('Project URL cần là URL gốc của project, không có phần đường dẫn sau tên miền. Hãy sao chép lại Project URL trong Project Settings → API.', true);
    return;
  }
  if (!window.supabase?.createClient) {
    setAuthStatus('Không tải được thư viện xác thực. Kiểm tra kết nối mạng rồi tải lại trang.', true);
    return;
  }

  try {
    supabaseClient = window.supabase.createClient(projectUrl.origin, config.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    setAuthSession(data.session);
    if (data.session) showEmailConfirmationSuccess(data.session.user);
    supabaseClient.auth.onAuthStateChange((event, session) => {
      setAuthSession(session);
      if (event === 'SIGNED_IN' && session) showEmailConfirmationSuccess(session.user);
    });
    setupNote.classList.add('hidden');
  } catch (error) {
    setAuthStatus(error.message || 'Không thể khởi tạo đăng nhập. Kiểm tra cấu hình Supabase.', true);
  }
}

function setAuthSession(session) {
  const authenticated = Boolean(session?.user);
  const uploadStatus = document.getElementById('community-upload-status');
  if (uploadStatus && !uploadStatus.classList.contains('is-error')) {
    uploadStatus.textContent = authenticated
      ? 'Bạn đã đăng nhập. Chọn tệp âm thanh để đăng công khai.'
      : 'Đăng nhập SpotiSix trước khi đăng nhạc công khai.';
  }
  const nearbyName = session?.user?.user_metadata?.display_name || session?.user?.email?.split('@')[0] || '';
  window.setNearbyIdentity?.(nearbyName);
  window.getNearbySupabaseClient = () => supabaseClient;
  document.getElementById('auth-screen').classList.toggle('hidden', authenticated);
  document.body.classList.toggle('is-authenticated', authenticated);
  document.getElementById('auth-screen').setAttribute('aria-hidden', String(authenticated));
  ['sidebar', 'main-content', 'now-playing-bar', 'expanded-player'].forEach(id => {
    document.getElementById(id).inert = !authenticated;
  });
  if (authenticated) {
    const displayName = session.user.user_metadata?.display_name || session.user.email;
    document.querySelectorAll('.user-name').forEach(element => {
      element.textContent = displayName;
    });
    document.querySelectorAll('.user-avatar, .topbar-avatar').forEach(element => {
      element.textContent = (displayName || 'S').trim().charAt(0).toUpperCase();
    });
    document.getElementById('auth-password').value = '';
    document.getElementById('auth-confirm-password').value = '';
    document.getElementById('account-email').textContent = session.user.email || 'Tài khoản SpotiSix';
    setAuthStatus('');
  }
}

function authEmailRedirectUrl() {
  const redirectUrl = new URL(window.location.href);
  redirectUrl.search = '';
  redirectUrl.hash = '';
  return redirectUrl.toString();
}

function showEmailConfirmation(email) {
  document.getElementById('auth-form').classList.add('hidden');
  document.getElementById('auth-switch-prompt').classList.add('hidden');
  document.getElementById('auth-status').classList.add('hidden');
  document.getElementById('email-confirmation').classList.remove('hidden');
  document.getElementById('pending-confirm-email').textContent = email;
  document.getElementById('resend-email-status').textContent = '';
  document.getElementById('resend-email-status').classList.remove('is-error');
}

function returnToSignIn() {
  document.getElementById('email-confirmation').classList.add('hidden');
  document.getElementById('auth-form').classList.remove('hidden');
  document.getElementById('auth-switch-prompt').classList.remove('hidden');
  document.getElementById('auth-status').classList.remove('hidden');
  document.getElementById('auth-email').value = '';
  document.getElementById('auth-password').value = '';
  document.getElementById('auth-confirm-password').value = '';
  if (authMode === 'signup') toggleAuthMode();
  setAuthStatus('');
}

async function resendConfirmationEmail() {
  if (!supabaseClient) {
    setAuthStatus('Dịch vụ đăng nhập chưa được khởi tạo. Tải lại trang và thử lại.', true);
    return;
  }
  const email = document.getElementById('pending-confirm-email').textContent.trim();
  const button = document.getElementById('resend-email-btn');
  const status = document.getElementById('resend-email-status');
  button.disabled = true;
  status.textContent = 'Đang gửi lại email…';
  status.classList.remove('is-error');
  try {
    const { error } = await supabaseClient.auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: authEmailRedirectUrl() },
    });
    if (error) throw error;
    status.textContent = 'Đã gửi lại email xác nhận. Kiểm tra cả thư mục spam/quảng cáo.';
  } catch (error) {
    status.textContent = error.message || 'Không gửi lại được email xác nhận. Vui lòng thử lại.';
    status.classList.add('is-error');
  } finally {
    button.disabled = false;
  }
}

function showEmailConfirmationSuccess(user) {
  const pendingEmail = localStorage.getItem(pendingConfirmationEmailKey);
  if (!pendingEmail || pendingEmail.toLowerCase() !== user.email?.toLowerCase() || !user.email_confirmed_at) return;
  localStorage.removeItem(pendingConfirmationEmailKey);
  const toast = document.getElementById('auth-toast');
  toast.textContent = 'Email đã được xác nhận. Tài khoản SpotiSix của bạn đã sẵn sàng.';
  toast.classList.remove('hidden');
  window.setTimeout(() => toast.classList.add('hidden'), 7000);
}

function setAuthStatus(message, isError = false) {
  const status = document.getElementById('auth-status');
  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

function toggleAuthMode() {
  authMode = authMode === 'signin' ? 'signup' : 'signin';
  const signingUp = authMode === 'signup';
  document.getElementById('auth-title').textContent = signingUp ? 'Tạo tài khoản SpotiSix' : 'Đăng nhập SpotiSix';
  document.getElementById('auth-submit-btn').textContent = signingUp ? 'Tạo tài khoản' : 'Đăng nhập';
  document.getElementById('auth-switch-copy').textContent = signingUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?';
  document.getElementById('auth-switch-btn').textContent = signingUp ? 'Đăng nhập' : 'Đăng ký';
  document.getElementById('auth-confirm-wrap').classList.toggle('hidden', !signingUp);
  document.getElementById('auth-password').setAttribute('autocomplete', signingUp ? 'new-password' : 'current-password');
  document.getElementById('auth-confirm-password').required = signingUp;
  setAuthStatus('');
}

async function submitAuth(event) {
  event.preventDefault();
  if (!supabaseClient) {
    setAuthStatus('Đăng nhập chưa được cấu hình. Điền Project URL và Publishable/anon key vào supabase-config.js rồi tải lại.', true);
    return;
  }

  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const submitButton = document.getElementById('auth-submit-btn');
  if (authMode === 'signup' && password !== document.getElementById('auth-confirm-password').value) {
    setAuthStatus('Mật khẩu xác nhận không khớp.', true);
    return;
  }

  submitButton.disabled = true;
  setAuthStatus(authMode === 'signup' ? 'Đang tạo tài khoản…' : 'Đang đăng nhập…');
  try {
    if (authMode === 'signup') {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: email.split('@')[0] },
          emailRedirectTo: authEmailRedirectUrl(),
        },
      });
      if (error) throw error;
      if (!data.session) {
        localStorage.setItem(pendingConfirmationEmailKey, email);
        showEmailConfirmation(email);
      } else {
        setAuthSession(data.session);
      }
    } else {
      const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setAuthSession(data.session);
    }
  } catch (error) {
    setAuthStatus(error.message || 'Không thể xác thực. Vui lòng thử lại.', true);
  } finally {
    submitButton.disabled = false;
  }
}

async function signOut() {
  if (!supabaseClient) return;
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    setAuthStatus(error.message || 'Không thể đăng xuất. Vui lòng thử lại.', true);
    return;
  }
  spotifyAccessToken = null;
  spotifyTracks = [];
  spotifySearchRequestId++;
  clearTimeout(spotifySearchTimeout);
  document.getElementById('spotify-library-results').replaceChildren();
  setSpotifyConnected(false);
  setSpotifyStatus('Đã đăng xuất khỏi SpotiSix.');
  state.isPlaying = false;
  clearInterval(timerInterval);
  syncPlayIcons();
}

function initializeAccountFeatures() {
  try {
    const storedHistory = JSON.parse(localStorage.getItem(recentSongsKey) || '[]');
    recentSongIds = Array.isArray(storedHistory)
      ? storedHistory.filter(index => Number.isInteger(index) && index >= 0 && index < songs.length).slice(0, 20)
      : [];
  } catch (error) {
    console.error('Không thể đọc lịch sử nghe gần đây đã lưu.', error);
    recentSongIds = [];
  }
  try {
    const storedArtists = JSON.parse(localStorage.getItem(followedArtistsStorageKey) || 'null');
    if (Array.isArray(storedArtists)) {
      const availableArtists = new Set(
        Array.from(document.querySelectorAll('#lib-artists .artist-name'), artist => artist.textContent)
      );
      followedArtists = new Set(storedArtists.filter(name => typeof name === 'string' && availableArtists.has(name)));
    }
  } catch (error) {
    console.error('Không thể đọc danh sách nghệ sĩ đang theo dõi đã lưu.', error);
  }
  document.querySelectorAll('#lib-artists .follow-btn').forEach(button => {
    button.type = 'button';
    button.addEventListener('click', () => toggleArtistFollow(button));
  });
  updateArtistFollowButtons();
  renderProfileCollections();
  document.querySelectorAll('.setting-switch[data-setting]').forEach(toggle => {
    const stored = localStorage.getItem(`${settingsKey}.${toggle.dataset.setting}`);
    if (stored !== null) setSwitchState(toggle, stored === 'true');
  });
  document.querySelectorAll('.setting-select[data-setting]').forEach(select => {
    const stored = localStorage.getItem(`${settingsKey}.${select.dataset.setting}`);
    if (stored && Array.from(select.options).some(option => option.value === stored)) select.value = stored;
    select.addEventListener('change', () => localStorage.setItem(`${settingsKey}.${select.dataset.setting}`, select.value));
  });
  document.getElementById('privacy-switch').setAttribute('aria-checked', String(privateSession));
  document.getElementById('privacy-switch').classList.toggle('is-on', privateSession);
  updatePrivacyCopy();
}

function toggleProfileMenu(event) {
  event?.stopPropagation();
  const menu = document.getElementById('profile-menu');
  const opening = menu.classList.contains('hidden');
  closeProfileMenu();
  if (!opening) return;
  menu.classList.remove('hidden');
  const trigger = event?.currentTarget;
  const rect = trigger?.getBoundingClientRect();
  if (rect) {
    const menuWidth = Math.min(300, window.innerWidth - 24);
    menu.style.width = `${menuWidth}px`;
    menu.style.left = `${Math.max(12, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 12))}px`;
    menu.style.top = `${Math.max(12, Math.min(rect.bottom + 10, window.innerHeight - menu.offsetHeight - 12))}px`;
  }
  document.querySelectorAll('.global-profile-trigger').forEach(button => button.setAttribute('aria-expanded', 'true'));
}

function closeProfileMenu() {
  document.getElementById('profile-menu').classList.add('hidden');
  document.querySelectorAll('.global-profile-trigger').forEach(button => button.setAttribute('aria-expanded', 'false'));
}

function closeProfileMenuOnOutsideClick(event) {
  if (!event.target.closest('#profile-menu, .global-profile-trigger')) closeProfileMenu();
}

function openAccountView() {
  const accountEmail = document.getElementById('account-email');
  if (!accountEmail.textContent || accountEmail.textContent === 'Tài khoản SpotiSix') {
    const email = document.getElementById('auth-email').value.trim();
    if (email) accountEmail.textContent = email;
  }
  showView('account');
}

function showAccountNotice(message) {
  const notice = document.getElementById('account-notice');
  notice.textContent = `${message}: chức năng này hiện chưa được kết nối.`;
}

function setSwitchState(toggle, enabled) {
  toggle.setAttribute('aria-checked', String(enabled));
  toggle.classList.toggle('is-on', enabled);
}

function toggleSetting(toggle) {
  const enabled = toggle.getAttribute('aria-checked') !== 'true';
  setSwitchState(toggle, enabled);
  localStorage.setItem(`${settingsKey}.${toggle.dataset.setting}`, String(enabled));
}

function togglePrivacyMode() {
  privateSession = !privateSession;
  localStorage.setItem(privacyModeKey, String(privateSession));
  const toggle = document.getElementById('privacy-switch');
  setSwitchState(toggle, privateSession);
  toggle.setAttribute('aria-label', privateSession ? 'Tắt chế độ riêng tư' : 'Bật chế độ riêng tư');
  updatePrivacyCopy();
}

function updatePrivacyCopy() {
  document.getElementById('privacy-state-title').textContent = `Chế độ riêng tư đang ${privateSession ? 'bật' : 'tắt'}`;
  document.getElementById('privacy-state-description').textContent = privateSession
    ? 'Hoạt động nghe nhạc sẽ không được lưu vào lịch sử gần đây.'
    : 'Chỉ mình bạn biết mình đang nghe gì.';
}

function recordRecentSong(index) {
  if (privateSession) return;
  recentSongIds = [index, ...recentSongIds.filter(songIndex => songIndex !== index)].slice(0, 20);
  localStorage.setItem(recentSongsKey, JSON.stringify(recentSongIds));
  if (document.getElementById('view-recent').classList.contains('active')) renderRecentHistory();
}

function renderRecentHistory() {
  const albumContainer = document.getElementById('recent-albums');
  const trackContainer = document.getElementById('recent-tracks');
  const emptyState = document.getElementById('empty-recent');
  albumContainer.replaceChildren();
  trackContainer.replaceChildren();
  const recentSongs = recentSongIds.map(index => songs[index]).filter(Boolean);
  const seenAlbums = new Set();
  const albums = recentSongs.filter(song => {
    if (seenAlbums.has(song.album)) return false;
    seenAlbums.add(song.album);
    return true;
  });
  albums.forEach(song => {
    const card = document.createElement('button');
    card.className = 'lib-card recent-album-card';
    card.type = 'button';
    card.onclick = () => playSong(songs.indexOf(song));
    const image = document.createElement('img');
    image.className = 'lib-card-img';
    image.src = song.img;
    image.alt = song.album;
    const title = document.createElement('span');
    title.className = 'lib-card-name';
    title.textContent = song.album;
    const artist = document.createElement('span');
    artist.className = 'lib-card-sub';
    artist.textContent = song.artist;
    card.append(image, title, artist);
    albumContainer.appendChild(card);
  });
  recentSongIds.forEach((index, position) => {
    const song = songs[index];
    if (!song) return;
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'track-item recent-track-item';
    row.onclick = () => playSong(index);
    const number = document.createElement('span');
    number.className = 'track-num';
    number.textContent = String(position + 1);
    const image = document.createElement('img');
    image.className = 'track-thumb';
    image.src = song.img;
    image.alt = song.album;
    const details = document.createElement('span');
    details.className = 'track-details';
    const title = document.createElement('span');
    title.className = 'track-name';
    title.textContent = song.title;
    const artist = document.createElement('span');
    artist.className = 'track-artist';
    artist.textContent = `${song.artist} · ${song.album}`;
    details.append(title, artist);
    row.append(number, image, details);
    trackContainer.appendChild(row);
  });
  emptyState.classList.toggle('hidden', recentSongs.length > 0);
}

// ─── Greeting ──────────────────────────────────────────────────────
function setGreeting() {
  const h = new Date().getHours();
  let g = h < 12 ? 'Buổi sáng tốt lành!' : h < 17 ? 'Buổi chiều vui vẻ!' : 'Buổi tối thư giãn!';
  document.getElementById('greeting-text').textContent = g;
}

// ─── View Navigation ──────────────────────────────────────────────
function showView(name) {
  const view = document.getElementById('view-' + name);
  const navItem = document.getElementById('nav-' + name);
  if (!view) return;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  view.classList.add('active');
  if (navItem) navItem.classList.add('active');
  document.body.classList.toggle('home-dashboard', name === 'home');
  if (name === 'home') document.body.classList.remove('playlist-mode');
  closeProfileMenu();
  if (name === 'recent') renderRecentHistory();
  if (name === 'mood') renderMoodView();
}

function handleGlobalSearch(query) {
  showView('search');
  handleSearch(query);
}

function switchQueueTab(name) {
  const isRecent = name === 'recent';
  document.getElementById('queue-up-next').classList.toggle('hidden', isRecent);
  document.getElementById('queue-recent').classList.toggle('hidden', !isRecent);
  document.getElementById('queue-tab-up-next').classList.toggle('active', !isRecent);
  document.getElementById('queue-tab-recent').classList.toggle('active', isRecent);
}

function toggleQueuePanel(event) {
  if (event) event.stopPropagation();
  if (window.matchMedia('(max-width: 800px)').matches) {
    document.body.classList.toggle('queue-mobile-open');
    return;
  }
  document.body.classList.toggle('queue-hidden');
}

// ─── Play Song ────────────────────────────────────────────────────
function playSong(idx) {
  if (sharedListeningRole === 'guest') {
    showAppToast('Chủ phòng điều khiển bài hát khi đang nghe chung.');
    return;
  }
  if (!Number.isInteger(idx) || idx < 0 || idx >= songs.length) return;
  const queueIndex = state.playbackQueue.indexOf(idx);
  if (queueIndex === -1) {
    state.playbackQueue = [idx, ...songs.map((_, index) => index).filter(index => index !== idx)];
    state.queuePosition = 0;
  } else {
    state.queuePosition = queueIndex;
  }
  state.currentSong = idx;
  state.isPlaying = true;
  state.elapsed = 0;
  state.progress = 0;
  updatePlayerUI();
  window.dispatchEvent(new CustomEvent('spotisix:track-change', {
    detail: { ...songs[idx] },
  }));
  startTimer();
  updateTrackHighlight();
  buildUpNext();
  recordRecentSong(idx);
  if (sharedListeningRole === 'host') {
    window.dispatchEvent(new CustomEvent('spotisix:playback-change', {
      detail: getSharedPlaybackSnapshot(),
    }));
  }
}

function playPlaylist(idx) {
  const playlist = allPlaylists()[idx % allPlaylists().length];
  if (playlist) {
    openPlaylist(playlist.id);
    playActivePlaylist();
  }
}

// ─── Toggle Play/Pause ────────────────────────────────────────────
function togglePlay(e) {
  if (e) e.stopPropagation();
  if (sharedListeningRole === 'guest') {
    showAppToast('Chủ phòng điều khiển bài hát khi đang nghe chung.');
    return;
  }
  if (songs[state.currentSong].audioSrc && audioPlayer) {
    if (state.isPlaying) {
      audioPlayer.pause();
      state.isPlaying = false;
      syncPlayIcons();
    } else {
      audioPlayer.play().then(() => {
        state.isPlaying = true;
        syncPlayIcons();
      }).catch(error => {
        state.isPlaying = false;
        syncPlayIcons();
        showAppToast(`Không thể phát tệp âm thanh: ${error.message}`);
      });
    }
    return;
  }
  state.isPlaying = !state.isPlaying;
  if (state.isPlaying) {
    startTimer();
  } else {
    clearInterval(timerInterval);
  }
  syncPlayIcons();
}

function startTimer() {
  clearInterval(timerInterval);
  const song = songs[state.currentSong];
  if (song.audioSrc && audioPlayer) {
    audioPlayer.src = song.audioSrc;
    audioPlayer.volume = window.isKaraokeActive?.() || state.isMuted ? 0 : state.volume;
    audioPlayer.currentTime = 0;
    audioPlayer.play().catch(error => {
      state.isPlaying = false;
      syncPlayIcons();
      showAppToast(`Không thể phát tệp âm thanh: ${error.message}`);
    });
    return;
  }
  let previousTick = performance.now();
  timerInterval = setInterval(() => {
    if (!state.isPlaying) return;
    const now = performance.now();
    state.elapsed = Math.min(song.duration, state.elapsed + (now - previousTick) / 1000);
    previousTick = now;
    if (state.elapsed >= song.duration) {
      if (state.repeatMode === 2) {
        state.elapsed = 0;
        state.progress = 0;
      } else {
        advanceAfterTrackEnd();
        return;
      }
    }
    state.progress = state.elapsed / song.duration;
    updateProgress();
  }, 50);
}

// ─── Previous / Next ──────────────────────────────────────────────
function prevSong(e) {
  if (e) e.stopPropagation();
  if (sharedListeningRole === 'guest') {
    showAppToast('Chủ phòng điều khiển bài hát khi đang nghe chung.');
    return;
  }
  if (state.elapsed > 3) {
    state.elapsed = 0; state.progress = 0;
    if (songs[state.currentSong].audioSrc && audioPlayer) audioPlayer.currentTime = 0;
    updateProgress();
    return;
  }
  if (!state.playbackQueue.length) return;
  const next = state.isShuffle
    ? Math.floor(Math.random() * state.playbackQueue.length)
    : (state.queuePosition - 1 + state.playbackQueue.length) % state.playbackQueue.length;
  playSong(state.playbackQueue[next]);
}
function nextSong(e) {
  if (e) e.stopPropagation();
  if (sharedListeningRole === 'guest') {
    showAppToast('Chủ phòng điều khiển bài hát khi đang nghe chung.');
    return;
  }
  if (!state.playbackQueue.length) return;
  if (!state.isShuffle && state.queuePosition >= state.playbackQueue.length - 1) {
    if (state.repeatMode === 1) {
      playSong(state.playbackQueue[0]);
    } else {
      state.isPlaying = false;
      clearInterval(timerInterval);
      if (audioPlayer) audioPlayer.pause();
      syncPlayIcons();
    }
    return;
  }
  const next = state.isShuffle && state.playbackQueue.length > 1
    ? (state.queuePosition + 1 + Math.floor(Math.random() * (state.playbackQueue.length - 1))) % state.playbackQueue.length
    : state.queuePosition + 1;
  playSong(state.playbackQueue[next]);
}

function advanceAfterTrackEnd() {
  if (!state.playbackQueue.length) {
    state.isPlaying = false;
    syncPlayIcons();
    return;
  }
  const isLastTrack = state.queuePosition >= state.playbackQueue.length - 1;
  if (isLastTrack && state.repeatMode !== 1) {
    state.isPlaying = false;
    state.progress = 1;
    state.elapsed = songs[state.currentSong].duration;
    clearInterval(timerInterval);
    updatePlayerUI();
    return;
  }
  nextSong();
}

// ─── Shuffle / Repeat / Mute ──────────────────────────────────────
function toggleShuffle(e) {
  if (e) e.stopPropagation();
  state.isShuffle = !state.isShuffle;
  document.getElementById('shuffle-btn').classList.toggle('active', state.isShuffle);
  document.getElementById('exp-shuffle-btn').classList.toggle('active', state.isShuffle);
  document.getElementById('playlist-shuffle')?.classList.toggle('active', state.isShuffle);
}
function toggleRepeat(e) {
  if (e) e.stopPropagation();
  state.repeatMode = (state.repeatMode + 1) % 3;
  const label = ['Bật lặp lại', 'Lặp lại playlist', 'Lặp lại bài hát'];
  [document.getElementById('repeat-btn'), document.getElementById('exp-repeat-btn')].forEach(button => {
    button.classList.toggle('active', state.repeatMode !== 0);
    button.classList.toggle('repeat-one', state.repeatMode === 2);
    button.setAttribute('aria-label', label[state.repeatMode]);
    button.title = label[state.repeatMode];
  });
}
function toggleMute(e) {
  if (e) e.stopPropagation();
  state.isMuted = !state.isMuted;
  if (state.isMuted) {
    if (state.volume > 0) state.previousVolume = state.volume;
  } else if (state.volume === 0) {
    state.volume = state.previousVolume || 0.7;
  }
  updateVolumeUI();
}

// ─── Seek ────────────────────────────────────────────────────────
function seekFromPointer(event) {
  if (sharedListeningRole === 'guest') return;
  const bar = event.currentTarget.querySelector('.npb-progress-bar, .expanded-progress-bar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  const frac = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  const song = songs[state.currentSong];
  const duration = song.audioSrc && audioPlayer && Number.isFinite(audioPlayer.duration) ? audioPlayer.duration : song.duration;
  state.elapsed = frac * duration;
  state.progress = frac;
  if (song.audioSrc && audioPlayer && Number.isFinite(audioPlayer.duration)) {
    audioPlayer.currentTime = state.elapsed;
  }
  updateProgress();
  if (sharedListeningRole === 'host') {
    window.dispatchEvent(new CustomEvent('spotisix:playback-change', {
      detail: getSharedPlaybackSnapshot(),
    }));
  }
}

function startSeek(event) {
  event.preventDefault();
  event.stopPropagation();
  seekingPointerId = event.pointerId;
  event.currentTarget.setPointerCapture(event.pointerId);
  seekFromPointer(event);
}

function updateSeek(event) {
  if (event.pointerId !== seekingPointerId) return;
  event.stopPropagation();
  seekFromPointer(event);
}

function finishSeek(event) {
  if (event.pointerId !== seekingPointerId) return;
  event.stopPropagation();
  seekFromPointer(event);
  seekingPointerId = null;
}

function handleSeekKeydown(event) {
  if (sharedListeningRole === 'guest') {
    event.preventDefault();
    showAppToast('Chủ phòng điều khiển tiến độ khi đang nghe chung.');
    return;
  }
  const song = songs[state.currentSong];
  const duration = song.audioSrc && audioPlayer && Number.isFinite(audioPlayer.duration) ? audioPlayer.duration : song.duration;
  let nextTime = state.elapsed;
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextTime = Math.min(duration, nextTime + 5);
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextTime = Math.max(0, nextTime - 5);
  else if (event.key === 'Home') nextTime = 0;
  else if (event.key === 'End') nextTime = duration;
  else return;
  event.preventDefault();
  event.stopPropagation();
  state.elapsed = nextTime;
  state.progress = duration ? nextTime / duration : 0;
  if (song.audioSrc && audioPlayer && Number.isFinite(audioPlayer.duration)) audioPlayer.currentTime = nextTime;
  updateProgress();
  if (sharedListeningRole === 'host') {
    window.dispatchEvent(new CustomEvent('spotisix:playback-change', {
      detail: getSharedPlaybackSnapshot(),
    }));
  }
}

// ─── Volume ───────────────────────────────────────────────────────
function setVolumeFromPointer(event) {
  const bar = event.currentTarget.matches('.exp-volume-bar')
    ? event.currentTarget
    : event.currentTarget.querySelector('.volume-bar');
  if (!bar) return;
  const rect = bar.getBoundingClientRect();
  const frac = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
  state.volume = frac;
  state.previousVolume = frac || state.previousVolume;
  state.isMuted = frac === 0;
  if (audioPlayer) audioPlayer.volume = window.isKaraokeActive?.() || state.isMuted ? 0 : state.volume;
  updateVolumeUI();
}

function startVolumeChange(event) {
  event.preventDefault();
  event.stopPropagation();
  volumePointerId = event.pointerId;
  event.currentTarget.setPointerCapture(event.pointerId);
  setVolumeFromPointer(event);
}

function updateVolumeChange(event) {
  if (event.pointerId !== volumePointerId) return;
  event.stopPropagation();
  setVolumeFromPointer(event);
}

function finishVolumeChange(event) {
  if (event.pointerId !== volumePointerId) return;
  event.stopPropagation();
  setVolumeFromPointer(event);
  volumePointerId = null;
}

function handleVolumeKeydown(event) {
  let nextVolume = state.volume;
  if (event.key === 'ArrowRight' || event.key === 'ArrowUp') nextVolume = Math.min(1, state.volume + 0.05);
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') nextVolume = Math.max(0, state.volume - 0.05);
  else if (event.key === 'Home') nextVolume = 0;
  else if (event.key === 'End') nextVolume = 1;
  else return;
  event.preventDefault();
  event.stopPropagation();
  state.volume = nextVolume;
  state.previousVolume = nextVolume || state.previousVolume;
  state.isMuted = nextVolume === 0;
  updateVolumeUI();
}

function updateVolumeUI() {
  const volume = state.isMuted ? 0 : state.volume;
  if (audioPlayer) audioPlayer.volume = window.isKaraokeActive?.() ? 0 : volume;
  document.getElementById('volume-fill').style.width = (volume * 100) + '%';
  document.getElementById('exp-volume-fill').style.width = (volume * 100) + '%';
  document.querySelectorAll('[data-volume-slider]').forEach(slider => slider.setAttribute('aria-valuenow', String(Math.round(volume * 100))));
  document.getElementById('mute-btn').classList.toggle('active', state.isMuted || volume === 0);
  document.getElementById('mute-btn').setAttribute('aria-label', state.isMuted || volume === 0 ? 'Bật tiếng' : 'Tắt tiếng');
}

function handleNativeAudioEnded() {
  if (state.repeatMode === 2 && songs[state.currentSong]?.audioSrc) {
    audioPlayer.currentTime = 0;
    audioPlayer.play().catch(error => showAppToast(`Không thể phát lại tệp âm thanh: ${error.message}`));
    return;
  }
  advanceAfterTrackEnd();
}

function handlePlayerShortcuts(event) {
  const target = event.target;
  if (target instanceof HTMLElement &&
      (target.isContentEditable || target.closest('button, a, input, textarea, select, [role="slider"]'))) return;
  if (event.altKey || event.ctrlKey || event.metaKey) return;

  if (event.key === 'Escape' && state.isExpanded) {
    toggleExpanded();
    return;
  }
  if (event.code === 'Space') {
    event.preventDefault();
    togglePlay();
  } else if (event.key === 'ArrowRight') {
    state.elapsed = Math.min(songs[state.currentSong].duration, state.elapsed + 5);
    state.progress = state.elapsed / songs[state.currentSong].duration;
    if (songs[state.currentSong].audioSrc && audioPlayer) audioPlayer.currentTime = state.elapsed;
    updateProgress();
  } else if (event.key === 'ArrowLeft') {
    state.elapsed = Math.max(0, state.elapsed - 5);
    state.progress = state.elapsed / songs[state.currentSong].duration;
    if (songs[state.currentSong].audioSrc && audioPlayer) audioPlayer.currentTime = state.elapsed;
    updateProgress();
  } else if (event.key.toLowerCase() === 'm') {
    toggleMute();
  }
}

// ─── Like / Unlike ────────────────────────────────────────────────
function toggleLike(e, idx) {
  e.stopPropagation();
  if (state.likedSongs.has(idx)) state.likedSongs.delete(idx);
  else state.likedSongs.add(idx);
  localStorage.setItem(likedSongsStorageKey, JSON.stringify([...state.likedSongs]));
  renderActivePlaylist();
  if (idx === state.currentSong) syncLikeButtons();
}
function toggleLikeNPB(e) {
  e.stopPropagation();
  const idx = state.currentSong;
  if (state.likedSongs.has(idx)) state.likedSongs.delete(idx);
  else state.likedSongs.add(idx);
  localStorage.setItem(likedSongsStorageKey, JSON.stringify([...state.likedSongs]));
  renderActivePlaylist();
  syncLikeButtons();
}
function toggleLikeExpanded() {
  const idx = state.currentSong;
  if (state.likedSongs.has(idx)) state.likedSongs.delete(idx);
  else state.likedSongs.add(idx);
  localStorage.setItem(likedSongsStorageKey, JSON.stringify([...state.likedSongs]));
  renderActivePlaylist();
  syncLikeButtons();
}
function syncLikeButtons() {
  const liked = state.likedSongs.has(state.currentSong);
  document.getElementById('npb-like-btn').classList.toggle('liked', liked);
  document.getElementById('expanded-like-btn').classList.toggle('liked', liked);
  const likeBtn = document.getElementById('like-' + state.currentSong);
  if (likeBtn) likeBtn.classList.toggle('liked', liked);
  document.querySelectorAll('.mood-like-btn').forEach(btn => {
    const idx = Number(btn.dataset.songIndex);
    btn.classList.toggle('liked', state.likedSongs.has(idx));
  });
}

// ─── Expanded Player ──────────────────────────────────────────────
function toggleExpanded() {
  state.isExpanded = !state.isExpanded;
  const player = document.getElementById('expanded-player');
  player.classList.toggle('open', state.isExpanded);
  player.setAttribute('aria-hidden', String(!state.isExpanded));
  document.body.classList.toggle('player-expanded', state.isExpanded);
  if (!state.isExpanded) closeExpandedTrackOptions();
}

function toggleExpandedTrackOptions(event) {
  event.stopPropagation();
  const menu = document.getElementById('expanded-track-menu');
  const opening = menu.classList.contains('hidden');
  menu.classList.toggle('hidden', !opening);
  document.getElementById('expanded-options-btn').setAttribute('aria-expanded', String(opening));
}

function closeExpandedTrackOptions() {
  document.getElementById('expanded-track-menu').classList.add('hidden');
  document.getElementById('expanded-options-btn').setAttribute('aria-expanded', 'false');
}

function addCurrentTrackToQueue(event) {
  addToQueue(event, state.currentSong);
  closeExpandedTrackOptions();
}

function saveCurrentTrackToPlaylist(event) {
  addSongToActivePlaylist(event, state.currentSong);
  closeExpandedTrackOptions();
}

// ─── Update UI ────────────────────────────────────────────────────
function updatePlayerUI() {
  const song = songs[state.currentSong];
  const currentTrack = sharedTrackMetadata || song;
  // NPB
  document.getElementById('npb-art').src = currentTrack.img;
  document.getElementById('npb-title').textContent = currentTrack.title;
  document.getElementById('npb-artist').textContent = currentTrack.artist;
  document.getElementById('total-time').textContent = formatTime(currentTrack.duration);
  document.getElementById('exp-total-time').textContent = formatTime(currentTrack.duration);
  // Expanded
  document.getElementById('expanded-art-img').src = currentTrack.img;
  document.getElementById('expanded-title').textContent = currentTrack.title;
  document.getElementById('expanded-artist').textContent = currentTrack.artist;
  document.getElementById('expanded-album').textContent = currentTrack.album;
  document.getElementById('queue-current-title').textContent = currentTrack.title;
  document.getElementById('queue-current-artist').textContent = currentTrack.artist;
  document.querySelector('.queue-art').src = currentTrack.img;
  if (audioPlayer && !sharedRemoteAudio && audioPlayer.src !== song.audioSrc) audioPlayer.pause();
  buildQueuePanel();
  // Background blur
  document.getElementById('expanded-bg').style.backgroundImage = `url('${currentTrack.img}')`;
  syncPlayIcons();
  syncLikeButtons();
  updateProgress();
  updateVolumeUI();
  window.updateKaraokeAvailability?.();
}

function syncPlayIcons() {
  const pp = state.isPlaying;
  // Bottom bar
  const ppBtn = document.getElementById('play-pause-btn');
  ppBtn.querySelector('.icon-play').classList.toggle('hidden', pp);
  ppBtn.querySelector('.icon-pause').classList.toggle('hidden', !pp);
  // Expanded
  const epBtn = document.getElementById('exp-play-btn');
  epBtn.querySelector('.icon-play').classList.toggle('hidden', pp);
  epBtn.querySelector('.icon-pause').classList.toggle('hidden', !pp);
  // Spinning art
  document.querySelector('.npb-art-container').classList.toggle('spinning', pp);
  updateTrackHighlight();
}

function updateProgress() {
  const p = state.progress * 100;
  const t = formatTime(state.elapsed);
  document.getElementById('progress-fill').style.width = p + '%';
  document.getElementById('progress-thumb').style.left = p + '%';
  document.getElementById('expanded-fill').style.width = p + '%';
  document.getElementById('expanded-thumb').style.left = p + '%';
  document.getElementById('current-time').textContent = t;
  document.getElementById('exp-current-time').textContent = t;
  document.querySelectorAll('[aria-label="Tiến độ bài hát"]').forEach(slider => slider.setAttribute('aria-valuenow', String(Math.round(p))));
}

function updateNativeAudioProgress() {
  if (sharedRemoteAudio && Number.isFinite(audioPlayer.currentTime)) {
    state.elapsed = audioPlayer.currentTime;
    state.progress = sharedTrackMetadata?.duration
      ? state.elapsed / sharedTrackMetadata.duration
      : 0;
    updateProgress();
    return;
  }
  if (!songs[state.currentSong]?.audioSrc || !Number.isFinite(audioPlayer.duration)) return;
  state.elapsed = audioPlayer.currentTime;
  state.progress = state.elapsed / audioPlayer.duration;
  updateProgress();
}

function updateNativeAudioDuration() {
  const song = songs[state.currentSong];
  if (!song?.audioSrc || !Number.isFinite(audioPlayer.duration)) return;
  song.duration = Math.floor(audioPlayer.duration);
  document.getElementById('total-time').textContent = formatTime(song.duration);
  document.getElementById('exp-total-time').textContent = formatTime(song.duration);
  renderActivePlaylist();
  renderLocalLibraryTracks();
}

function updateTrackHighlight() {
  const tracks = activeTrackOrder || activePlaylist().tracks;
  document.querySelectorAll('.playlist-table .track-item').forEach((el, position) => {
    el.classList.toggle('playing', tracks[position] === state.currentSong);
  });
  document.querySelectorAll('.mood-track-row').forEach(el => {
    const idx = Number(el.dataset.songIndex);
    const isCurrent = idx === state.currentSong;
    el.classList.toggle('playing', isCurrent);
    const eq = el.querySelector('.mood-track-eq');
    const num = el.querySelector('.mood-track-num');
    if (eq && num) {
      if (isCurrent && state.isPlaying) {
        eq.classList.remove('hidden');
        num.classList.add('hidden');
      } else {
        eq.classList.add('hidden');
        num.classList.remove('hidden');
      }
    }
  });
}

// ─── Format time ──────────────────────────────────────────────────
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ─── Build Up Next ────────────────────────────────────────────────
function buildUpNext() {
  const list = document.getElementById('up-next-list');
  list.replaceChildren();
  for (let i = 1; i <= 3; i++) {
    const idx = (state.currentSong + i) % songs.length;
    const song = songs[idx];
    const div = document.createElement('button');
    div.className = 'up-next-item';
    div.type = 'button';
    div.addEventListener('click', () => playSong(idx));
    const image = document.createElement('img');
    image.src = song.img;
    image.alt = '';
    image.className = 'up-next-art';
    const info = document.createElement('span');
    info.className = 'up-next-info';
    const title = document.createElement('span');
    title.className = 'up-next-title';
    title.textContent = song.title;
    const artist = document.createElement('span');
    artist.className = 'up-next-artist';
    artist.textContent = song.artist;
    info.append(title, artist);
    const duration = document.createElement('span');
    duration.className = 'up-next-duration';
    duration.textContent = formatTime(song.duration);
    div.append(image, info, duration);
    list.appendChild(div);
  }

}

function buildQueuePanel() {
  const list = document.getElementById('queue-next-tracks');
  list.replaceChildren();
  for (let offset = 1; offset < state.playbackQueue.length; offset++) {
    const idx = state.playbackQueue[(state.queuePosition + offset) % state.playbackQueue.length];
    const song = songs[idx];
    const button = document.createElement('button');
    button.className = 'queue-track';
    button.type = 'button';
    button.addEventListener('click', () => playSong(idx));
    const image = document.createElement('img');
    image.src = song.img;
    image.alt = '';
    const info = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = song.title;
    const artist = document.createElement('small');
    artist.textContent = song.artist;
    info.append(title, artist);
    button.append(image, info);
    list.append(button);
  }
  const recent = document.getElementById('queue-recent-tracks');
  recent.replaceChildren();
  recentSongIds.forEach(idx => {
    const song = songs[idx];
    if (!song) return;
    const button = document.createElement('button');
    button.className = 'queue-track';
    button.type = 'button';
    button.addEventListener('click', () => playSong(idx));
    const image = document.createElement('img');
    image.src = song.img;
    image.alt = '';
    const info = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = song.title;
    const artist = document.createElement('small');
    artist.textContent = song.artist;
    info.append(title, artist);
    button.append(image, info);
    recent.append(button);
  });
}

// ─── Library Tabs ─────────────────────────────────────────────────
function switchLibTab(name) {
  const tabs = ['playlists','albums','artists','songs'];
  tabs.forEach(t => {
    document.getElementById('lib-' + t).classList.toggle('hidden', t !== name);
    document.getElementById('lib-tab-' + t).classList.toggle('active', t === name);
  });
  document.querySelectorAll('.library-filter').forEach((button, index) => {
    button.classList.toggle('active', tabs[index] === name);
  });
}

// ─── Search ───────────────────────────────────────────────────────
function normalizeSearchText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .toLocaleLowerCase();
}

function handleSearch(q) {
  const container = document.getElementById('search-results-container');
  const browse = document.getElementById('browse-categories');
  const results = document.getElementById('search-results');
  q = q.trim();
  if (!q) {
    clearTimeout(spotifySearchTimeout);
    spotifySearchRequestId++;
    container.classList.add('hidden');
    browse.classList.remove('hidden');
    return;
  }
  container.classList.remove('hidden');
  browse.classList.add('hidden');
  clearTimeout(spotifySearchTimeout);
  const requestId = ++spotifySearchRequestId;
  results.replaceChildren();

  const normalizedQuery = normalizeSearchText(q);
  const matches = songs
    .map((song, index) => ({ song, index }))
    .filter(({ song }) => normalizeSearchText(`${song.title} ${song.artist} ${song.album}`).includes(normalizedQuery));
  if (matches.length > 0) {
    const heading = document.createElement('h3');
    heading.className = 'search-source-heading';
    heading.textContent = 'Trong thư viện của bạn';
    results.appendChild(heading);
    matches.forEach(({ song, index }) => {
      const div = document.createElement('div');
      div.className = 'track-item';
      div.addEventListener('click', () => playSong(index));
      const number = document.createElement('span');
      number.className = 'track-num';
      number.textContent = String(index + 1);
      const cover = document.createElement('img');
      cover.src = song.img;
      cover.alt = '';
      cover.className = 'track-thumb';
      const details = document.createElement('div');
      details.className = 'track-details';
      const title = document.createElement('p');
      title.className = 'track-name';
      title.textContent = song.title;
      const artist = document.createElement('p');
      artist.className = 'track-artist';
      artist.textContent = `${song.artist} · ${song.album}`;
      details.append(title, artist);
      const meta = document.createElement('div');
      meta.className = 'track-meta';
      const queue = document.createElement('button');
      queue.type = 'button';
      queue.className = 'search-queue-btn';
      queue.setAttribute('aria-label', `Thêm ${song.title} vào danh sách chờ`);
      queue.textContent = '+';
      queue.addEventListener('click', event => addToQueue(event, index));
      const save = document.createElement('button');
      save.type = 'button';
      save.className = 'search-save-btn';
      save.setAttribute('aria-label', `Lưu ${song.title} vào playlist`);
      save.textContent = '♡';
      save.addEventListener('click', event => addSongToActivePlaylist(event, index));
      const duration = document.createElement('span');
      duration.className = 'track-duration';
      duration.textContent = formatTime(song.duration);
      meta.append(queue, save, duration);
      div.append(number, cover, details, meta);
      results.appendChild(div);
    });
  }

  searchPublishedTracks(normalizedQuery, requestId);
  if (spotifyAccessToken) {
    spotifySearchTimeout = setTimeout(() => searchSpotify(q, requestId), 350);
    return;
  }

  if (matches.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'spotify-empty-state';
    empty.textContent = 'Không tìm thấy kết quả phù hợp trong thư viện của bạn.';
    results.appendChild(empty);
  }
}

async function getSongsByMoodActivity(mood = null, activity = null) {
    if (!supabaseClient) {
        console.error("Supabase chưa được kết nối!");
        return [];
    }
    let query = supabaseClient
        .from("published_tracks")
        .select("*");

    if (mood) {
        query = query.eq("mood", mood);
    }

    if (activity) {
        query = query.eq("activity", activity);
    }
    const { data, error } = await query
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Lỗi truy vấn bài hát:", error.message);
        return [];
    }
    return data;
}

async function searchPublishedTracks(query, requestId) {
  if (!supabaseClient) return;
  const results = document.getElementById('search-results');
  const section = document.createElement('section');
  section.className = 'community-search-results';
  const heading = document.createElement('h3');
  heading.className = 'search-source-heading';
  heading.textContent = 'Nhạc trên SpotiSix';
  section.appendChild(heading);
  results.appendChild(section);

  try {
    const escapedQuery = query.replace(/[\\%_]/g, '\\$&');
    const { data: tracks, error } = await supabaseClient
      .from('published_tracks')
      .select('id, title, artist, album, object_path')
      .ilike('search_text', `%${escapedQuery}%`)
      .order('created_at', { ascending: false })
      .limit(30);
    if (requestId !== spotifySearchRequestId) return;
    if (error) throw error;

    if (!tracks.length) {
      const empty = document.createElement('p');
      empty.className = 'spotify-empty-state';
      empty.textContent = 'Chưa có bài phù hợp trong thư viện SpotiSix.';
      section.appendChild(empty);
      return;
    }
    tracks.forEach(track => {
      const index = addPublishedTrackToPlayer(track);
      const song = songs[index];
      const row = document.createElement('div');
      row.className = 'track-item';
      row.addEventListener('click', () => playSong(index));
      const number = document.createElement('span');
      number.className = 'track-num';
      number.textContent = '♪';
      const cover = document.createElement('img');
      cover.src = song.img;
      cover.alt = '';
      cover.className = 'track-thumb';
      const details = document.createElement('div');
      details.className = 'track-details';
      const title = document.createElement('p');
      title.className = 'track-name';
      title.textContent = song.title;
      const artist = document.createElement('p');
      artist.className = 'track-artist';
      artist.textContent = `${song.artist} · ${song.album}`;
      details.append(title, artist);
      const duration = document.createElement('span');
      duration.className = 'track-duration';
      duration.textContent = formatTime(song.duration);
      row.append(number, cover, details, duration);
      section.appendChild(row);
    });
  } catch (error) {
    if (requestId !== spotifySearchRequestId) return;
    const message = document.createElement('p');
    message.className = 'spotify-empty-state is-error';
    message.textContent = `Không thể tìm trong thư viện trực tuyến: ${error.message || 'Lỗi kết nối Supabase.'}`;
    section.appendChild(message);
  }
}

function searchCategory(cat) {
  document.getElementById('search-input').value = cat;
  handleSearch(cat);
}

// ─── Spotify ─────────────────────────────────────────────────────
const spotifyApiBase = 'https://api.spotify.com/v1';
const spotifyDefaultClientId = 'spak_2qmMNK4re2s5UrmtWmq9o9n9bgnBCKR0';
const spotifyClientIdKey = 'musiq.spotify.clientId';
const spotifyVerifierKey = 'musiq.spotify.pkceVerifier';
const spotifyStateKey = 'musiq.spotify.oauthState';

function spotifyRedirectUri() {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  return url.toString();
}

function initializeSpotify() {
  const clientIdInput = document.getElementById('spotify-client-id');
  const redirectUri = spotifyRedirectUri();
  document.getElementById('spotify-redirect-uri').textContent = redirectUri;
  clientIdInput.value = localStorage.getItem(spotifyClientIdKey) || spotifyDefaultClientId;
  completeSpotifyAuthorization();
}

function setSpotifyStatus(message, isError = false) {
  const status = document.getElementById('spotify-status');
  status.textContent = message;
  status.classList.toggle('is-error', isError);
}

function setSpotifyConnected(connected) {
  document.getElementById('spotify-connect-btn').classList.toggle('hidden', connected);
  document.getElementById('spotify-sync-btn').classList.toggle('hidden', !connected);
  document.getElementById('spotify-disconnect-btn').classList.toggle('hidden', !connected);
  document.getElementById('spotify-client-id').disabled = connected;
  document.getElementById('spotify-demo-library').classList.toggle('hidden', connected);
}

function randomUrlSafeString(byteLength) {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function createCodeChallenge(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

async function connectSpotify() {
  const clientId = document.getElementById('spotify-client-id').value.trim();
  if (!clientId) {
    setSpotifyStatus('Nhập Spotify Client ID trước khi kết nối.', true);
    return;
  }
  if (!['https:', 'http:'].includes(window.location.protocol) ||
      (window.location.protocol === 'http:' && !['localhost', '127.0.0.1'].includes(window.location.hostname))) {
    setSpotifyStatus('Hãy chạy ứng dụng trên localhost hoặc HTTPS để kết nối Spotify.', true);
    return;
  }
  if (!crypto.subtle) {
    setSpotifyStatus('Trình duyệt cần hỗ trợ Web Crypto trên HTTPS hoặc localhost.', true);
    return;
  }

  try {
    const verifier = randomUrlSafeString(64);
    const oauthState = randomUrlSafeString(16);
    const challenge = await createCodeChallenge(verifier);
    localStorage.setItem(spotifyClientIdKey, clientId);
    sessionStorage.setItem(spotifyVerifierKey, verifier);
    sessionStorage.setItem(spotifyStateKey, oauthState);

    const authorizeUrl = new URL('https://accounts.spotify.com/authorize');
    authorizeUrl.search = new URLSearchParams({
      client_id: clientId,
      response_type: 'code',
      redirect_uri: spotifyRedirectUri(),
      code_challenge_method: 'S256',
      code_challenge: challenge,
      state: oauthState,
      scope: 'user-library-read',
    });
    window.location.assign(authorizeUrl.toString());
  } catch (error) {
    setSpotifyStatus(error.message || 'Không thể bắt đầu đăng nhập Spotify.', true);
  }
}

async function completeSpotifyAuthorization() {
  const callbackUrl = new URL(window.location.href);
  const code = callbackUrl.searchParams.get('code');
  const oauthError = callbackUrl.searchParams.get('error');
  if (!code && !oauthError) return;

  const returnedState = callbackUrl.searchParams.get('state');
  const expectedState = sessionStorage.getItem(spotifyStateKey);
  const verifier = sessionStorage.getItem(spotifyVerifierKey);
  callbackUrl.search = '';
  callbackUrl.hash = '';
  window.history.replaceState({}, document.title, callbackUrl.toString());
  sessionStorage.removeItem(spotifyStateKey);
  sessionStorage.removeItem(spotifyVerifierKey);

  if (oauthError) {
    setSpotifyStatus(`Spotify không cấp quyền truy cập: ${oauthError}.`, true);
    return;
  }
  if (!expectedState || returnedState !== expectedState || !verifier) {
    setSpotifyStatus('Không xác minh được phiên đăng nhập Spotify. Hãy thử kết nối lại.', true);
    return;
  }

  const clientId = document.getElementById('spotify-client-id').value.trim();
  try {
    setSpotifyStatus('Đang xác thực tài khoản Spotify…');
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: spotifyRedirectUri(),
        code_verifier: verifier,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error_description || data.error || 'Không thể xác thực với Spotify.');
    spotifyAccessToken = data.access_token;
    setSpotifyConnected(true);
    await loadSpotifyLibrary();
  } catch (error) {
    setSpotifyStatus(error.message || 'Không thể kết nối Spotify.', true);
  }
}

async function spotifyApiRequest(endpoint) {
  if (!spotifyAccessToken) throw new Error('Phiên Spotify đã hết hạn. Hãy kết nối lại.');
  const response = await fetch(endpoint.startsWith('https://')
    ? endpoint
    : `${spotifyApiBase}${endpoint}`, {
    headers: { Authorization: `Bearer ${spotifyAccessToken}` },
  });
  const data = await response.json();
  if (response.status === 401) {
    spotifyAccessToken = null;
    setSpotifyConnected(false);
    setSpotifyStatus('Phiên Spotify đã hết hạn. Hãy kết nối lại để tiếp tục.', true);
  }
  if (!response.ok) {
    throw new Error(data.error?.message || 'Spotify không thể xử lý yêu cầu.');
  }
  return data;
}

async function loadSpotifyLibrary() {
  if (!spotifyAccessToken) {
    setSpotifyStatus('Kết nối Spotify trước khi tải thư viện.', true);
    return;
  }

  try {
    setSpotifyStatus('Đang tải bài hát đã lưu từ Spotify…');
    const tracks = [];
    let offset = 0;
    let nextPage = true;
    while (nextPage) {
      const page = await spotifyApiRequest(`/me/tracks?limit=50&offset=${offset}`);
      page.items.forEach(item => {
        const track = item.track;
        if (track && !track.is_local) tracks.push(normalizeSpotifyTrack(track));
      });
      setSpotifyStatus(`Đã tải ${tracks.length}${page.total ? ` / ${page.total}` : ''} bài hát…`);
      nextPage = Boolean(page.next) && page.items.length > 0;
      offset += page.items.length;
    }

    spotifyTracks = tracks;
    renderSpotifyLibrary();
    setSpotifyConnected(true);
    setSpotifyStatus(`Đã tải ${tracks.length} bài hát đã lưu từ Spotify.`);
  } catch (error) {
    setSpotifyStatus(error.message || 'Không thể tải thư viện Spotify.', true);
  }
}

function normalizeSpotifyTrack(track) {
  const images = track.album?.images || [];
  return {
    id: track.id,
    title: track.name,
    artist: (track.artists || []).map(artist => artist.name).join(', '),
    album: track.album?.name || '',
    duration: Math.floor(track.duration_ms / 1000),
    img: images[0]?.url || images[1]?.url || images[2]?.url || 'album_lumina.jpg',
    url: track.external_urls?.spotify || `https://open.spotify.com/track/${encodeURIComponent(track.id)}`,
  };
}

function createSpotifyTrackRow(track, index) {
  const row = document.createElement('a');
  row.className = 'track-item spotify-track-item';
  row.href = track.url;
  row.target = '_blank';
  row.rel = 'noopener noreferrer';
  row.setAttribute('aria-label', `Mở ${track.title} trên Spotify`);
  row.dataset.searchText = `${track.title} ${track.artist} ${track.album}`.toLocaleLowerCase();

  const number = document.createElement('span');
  number.className = 'track-num';
  number.textContent = String(index + 1);
  const cover = document.createElement('img');
  cover.className = 'track-thumb';
  cover.src = track.img;
  cover.alt = `Ảnh bìa ${track.album || track.title}`;
  const details = document.createElement('div');
  details.className = 'track-details';
  const title = document.createElement('p');
  title.className = 'track-name';
  title.textContent = track.title;
  const description = document.createElement('p');
  description.className = 'track-artist';
  description.textContent = [track.artist, track.album].filter(Boolean).join(' · ');
  details.append(title, description);
  const meta = document.createElement('div');
  meta.className = 'track-meta';
  const duration = document.createElement('span');
  duration.className = 'track-duration';
  duration.textContent = formatTime(track.duration);
  meta.appendChild(duration);
  row.append(number, cover, details, meta);
  return row;
}

function renderSpotifyLibrary() {
  const container = document.getElementById('spotify-library-results');
  container.replaceChildren();
  if (spotifyTracks.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'spotify-empty-state';
    empty.textContent = 'Thư viện Spotify chưa có bài hát đã lưu.';
    container.appendChild(empty);
    return;
  }
  const fragment = document.createDocumentFragment();
  spotifyTracks.forEach((track, index) => fragment.appendChild(createSpotifyTrackRow(track, index)));
  container.appendChild(fragment);
  filterLibraryItems(librarySearchQuery);
}

async function searchSpotify(query, requestId) {
  const results = document.getElementById('search-results');
  const loading = document.createElement('p');
  loading.className = 'spotify-empty-state spotify-search-loading';
  loading.textContent = 'Đang tìm trên Spotify…';
  results.querySelector('.spotify-search-results')?.remove();
  results.querySelector('.spotify-search-loading')?.remove();
  results.appendChild(loading);

  try {
    const params = new URLSearchParams({ q: query, type: 'track', limit: '20' });
    const response = await spotifyApiRequest(`/search?${params}`);
    if (requestId !== spotifySearchRequestId) return;
    const tracks = response.tracks.items.map(normalizeSpotifyTrack);
    loading.remove();
    const spotifyResults = document.createElement('div');
    spotifyResults.className = 'spotify-search-results';
    const heading = document.createElement('h3');
    heading.className = 'search-source-heading';
    heading.textContent = 'Kết quả trên Spotify';
    spotifyResults.appendChild(heading);
    if (tracks.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'spotify-empty-state';
      empty.textContent = 'Không tìm thấy kết quả trên Spotify.';
      spotifyResults.appendChild(empty);
    } else {
      const fragment = document.createDocumentFragment();
      tracks.forEach((track, index) => fragment.appendChild(createSpotifyTrackRow(track, index)));
      spotifyResults.appendChild(fragment);
    }
    results.appendChild(spotifyResults);
  } catch (error) {
    if (requestId !== spotifySearchRequestId) return;
    const message = document.createElement('p');
    message.className = 'spotify-empty-state is-error';
    message.textContent = error.message || 'Không thể tìm kiếm trên Spotify.';
    loading.remove();
    const spotifyResults = document.createElement('div');
    spotifyResults.className = 'spotify-search-results';
    const heading = document.createElement('h3');
    heading.className = 'search-source-heading';
    heading.textContent = 'Kết quả trên Spotify';
    spotifyResults.append(heading, message);
    results.appendChild(spotifyResults);
  }
}

function disconnectSpotify() {
  spotifyAccessToken = null;
  spotifyTracks = [];
  spotifySearchRequestId++;
  clearTimeout(spotifySearchTimeout);
  document.getElementById('spotify-library-results').replaceChildren();
  setSpotifyConnected(false);
  setSpotifyStatus('Đã ngắt kết nối Spotify. Client ID vẫn được lưu trên thiết bị này.');
  const searchInput = document.getElementById('search-input');
  if (searchInput.value.trim()) handleSearch(searchInput.value);
}

async function updatePublishedTrackMoodActivity(trackId, mood, activity) {
}
async function getPublishedTracksByMoodActivity(
    mood = null,
    activity = null,
    limit = 30
) {
    if (!supabaseClient) {
        throw new Error("Supabase chưa được cấu hình.");
    }

    const safeLimit = Math.min(
        100,
        Math.max(1, Number.parseInt(limit, 10) || 30)
    );

    let query = supabaseClient
        .from("published_tracks")
        .select(
            "id, title, artist, album, object_path, mood, activity, created_at"
        );

    const selectedMood =
        typeof mood === "string" ? mood.trim() : "";

    const selectedActivity =
        typeof activity === "string" ? activity.trim() : "";

    if (selectedMood) {
        query = query.eq("mood", selectedMood);
    }

    if (selectedActivity) {
        query = query.eq("activity", selectedActivity);
    }

    const { data, error } = await query
        .order("created_at", { ascending: false })
        .limit(safeLimit);

    if (error) {
        console.error("Không thể lọc bài hát:", error);
        throw error;
    }

    return data || [];
}

window.getPublishedTracksByMoodActivity =
    getPublishedTracksByMoodActivity;
