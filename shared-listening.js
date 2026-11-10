const banner = document.getElementById('shared-listening-banner');
const bannerLabel = document.getElementById('shared-listening-label');
const inviteDialog = document.createElement('dialog');
inviteDialog.className = 'playlist-dialog shared-invite-dialog';
inviteDialog.innerHTML = `
  <form method="dialog">
    <span class="eyebrow">SPOTISIX · NGHE CHUNG</span>
    <h2>Tham gia nghe nhạc chung?</h2>
    <p id="shared-invite-copy"></p>
    <div class="dialog-actions">
      <button class="dialog-cancel" type="button" id="shared-invite-decline">Từ chối</button>
      <button class="dialog-submit" type="button" id="shared-invite-accept">Tham gia</button>
    </div>
  </form>`;
document.body.append(inviteDialog);

const inviteCopy = inviteDialog.querySelector('#shared-invite-copy');
const acceptInviteButton = inviteDialog.querySelector('#shared-invite-accept');
const declineInviteButton = inviteDialog.querySelector('#shared-invite-decline');
const roomIndicator = document.getElementById('shared-room-indicator');
const roomIndicatorMembers = document.getElementById('shared-room-indicator-members');
const clientId = globalThis.crypto?.randomUUID?.() || `client-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const peerConnections = new Map();
const pendingIceCandidates = new Map();
const pendingInviteResponses = new Map();
let discoveryChannel = null;
let ownSessionKey = null;
let roomChannel = null;
let roomId = null;
let pendingRoomId = null;
let roomRole = null;
let roomHostId = null;
let roomHostName = '';
let activeInvite = null;
let hostAudioStream = null;
let localDemoRoom = null;
let hostStateTimer = null;
let hostRoomJoinPromise = null;
let guestClockTimer = null;
let roomLocation = null;
let distanceCheckInProgress = false;
let distanceLimitTriggered = false;
const pendingClockPings = new Map();
const clockSync = { offsetMs: 0, rttMs: null, samples: 0 };

window.setSharedListeningDiscoveryChannel = function setSharedListeningDiscoveryChannel(channel, sessionKey) {
  discoveryChannel = channel;
  ownSessionKey = sessionKey;
};

window.inviteForSharedListening = async function inviteForSharedListening(targetSessionKey, displayName) {
  if (!discoveryChannel || !ownSessionKey) {
    showAppToast('Bật tìm kiếm online trước khi mời người nghe chung.');
    return;
  }
  const isAlreadyInRoom = Boolean(roomChannel && roomId && roomRole);
  if (!isAlreadyInRoom && !prepareHostAudioSharing()) return;

  const inviteRoomId = roomId || pendingRoomId || globalThis.crypto?.randomUUID?.();
  if (!inviteRoomId) {
    showAppToast('Trình duyệt không hỗ trợ tạo phòng nghe chung an toàn.');
    return;
  }
  if (!isAlreadyInRoom) pendingRoomId = inviteRoomId;
  const inviteId = globalThis.crypto?.randomUUID?.() || `invite-${Date.now()}`;
  const timeoutId = window.setTimeout(() => {
    const pending = pendingInviteResponses.get(inviteId);
    if (!pending) return;
    pendingInviteResponses.delete(inviteId);
    pending.reject(new Error(`${displayName} chưa phản hồi lời mời nghe chung.`));
    if (!pendingInviteResponses.size && !roomChannel) pendingRoomId = null;
  }, 30000);
  const responsePromise = new Promise((resolve, reject) => {
    pendingInviteResponses.set(inviteId, { targetSessionKey, ownSessionKey, resolve, reject, timeoutId });
  });

  try {
    const status = await discoveryChannel.send({
      type: 'broadcast',
      event: 'listen-invite',
      payload: {
        inviteId,
        roomId: inviteRoomId,
        targetSessionKey,
        fromSessionKey: ownSessionKey,
        fromName: getLocalDisplayName(),
      },
    });
    if (status !== 'ok') throw new Error(`Không thể gửi lời mời (${status || 'Realtime'}).`);
    const response = await responsePromise;
    if (!response.accepted) {
      if (!pendingInviteResponses.size && !roomChannel) pendingRoomId = null;
      showAppToast(`${displayName} đã từ chối lời mời nghe chung.`);
      return;
    }
    if (hostRoomJoinPromise) {
      await hostRoomJoinPromise;
      await sendRoomMessage('room-state', { snapshot: getSharedAudioTrackSnapshot() });
    } else if (!roomChannel) {
      hostRoomJoinPromise = joinRoom({
        roomId: inviteRoomId,
        role: 'host',
        hostId: clientId,
        hostName: getLocalDisplayName(),
      }).finally(() => {
        hostRoomJoinPromise = null;
      });
      await hostRoomJoinPromise;
    } else if (roomRole === 'host') {
      await sendRoomMessage('room-state', { snapshot: getSharedAudioTrackSnapshot() });
    }
  } catch (error) {
    window.clearTimeout(timeoutId);
    pendingInviteResponses.delete(inviteId);
    if (!pendingInviteResponses.size && !roomChannel) pendingRoomId = null;
    showAppToast(error instanceof Error ? error.message : 'Không thể mời nghe chung.');
  }
};

window.receiveSharedListeningInvite = function receiveSharedListeningInvite(payload) {
  if (roomRole) {
    void respondToInvite(payload, false);
    showAppToast('Đang ở trong một phòng nghe chung; rời phòng hiện tại để tham gia phòng khác.');
    return;
  }
  activeInvite = payload;
  inviteCopy.textContent = `${payload.fromName || 'Một người dùng SpotiSix'} mời bạn nghe chung bài đang phát.`;
  if (!inviteDialog.open) inviteDialog.showModal();
};

window.receiveSharedListeningInviteResponse = function receiveSharedListeningInviteResponse(payload) {
  const pending = pendingInviteResponses.get(payload.inviteId);
  if (!pending ||
      pending.ownSessionKey !== payload.targetSessionKey ||
      pending.targetSessionKey !== payload.fromSessionKey) return;
  window.clearTimeout(pending.timeoutId);
  pendingInviteResponses.delete(payload.inviteId);
  pending.resolve(payload);
};

acceptInviteButton.addEventListener('click', () => {
  if (!activeInvite) return;
  const invite = activeInvite;
  activeInvite = null;
  inviteDialog.close();
  void respondToInvite(invite, true);
  void joinRoom({
    roomId: invite.roomId,
    role: 'guest',
    hostId: null,
    hostName: invite.fromName || 'chủ phòng',
  }).catch(error => {
    showAppToast(error instanceof Error ? error.message : 'Không thể tham gia phòng nghe chung.');
  });
});

declineInviteButton.addEventListener('click', () => {
  if (!activeInvite) return;
  void respondToInvite(activeInvite, false);
  activeInvite = null;
  inviteDialog.close();
});

inviteDialog.addEventListener('click', event => {
  if (event.target === inviteDialog && activeInvite) {
    void respondToInvite(activeInvite, false);
    activeInvite = null;
  }
});

inviteDialog.addEventListener('cancel', event => {
  event.preventDefault();
  if (!activeInvite) return;
  void respondToInvite(activeInvite, false);
  activeInvite = null;
  inviteDialog.close();
});

window.leaveSharedListening = async function leaveSharedListening() {
  window.clearInterval(hostStateTimer);
  window.clearInterval(guestClockTimer);
  hostStateTimer = null;
  guestClockTimer = null;
  pendingClockPings.clear();
  roomLocation = null;
  distanceCheckInProgress = false;
  distanceLimitTriggered = false;
  clockSync.offsetMs = 0;
  clockSync.rttMs = null;
  clockSync.samples = 0;
  for (const connection of peerConnections.values()) connection.close();
  peerConnections.clear();
  pendingIceCandidates.clear();
  if (roomChannel) {
    const channel = roomChannel;
    roomChannel = null;
    try {
      await window.getNearbySupabaseClient?.()?.removeChannel(channel);
    } catch {}
  }
  roomId = null;
  pendingRoomId = null;
  roomRole = null;
  roomHostId = null;
  roomHostName = '';
  hostAudioStream = null;
  localDemoRoom = null;
  banner.classList.add('hidden');
  roomIndicator.classList.add('hidden');
  roomIndicatorMembers.textContent = '';
  document.body.classList.remove('has-shared-listening-room');
  window.clearSharedAudio?.();
  window.dispatchEvent(new CustomEvent('spotisix:shared-room-updated', {
    detail: { active: false },
  }));
};

window.isSharedListeningActive = () => Boolean(roomRole || localDemoRoom);
window.getSharedListeningRole = () => roomRole;

function getRoomAudioUrl(audioSrc) {
  if (typeof audioSrc !== 'string' || !audioSrc.trim()) return '';
  try {
    const url = new URL(audioSrc, window.location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch {
    return '';
  }
}

function isLoopbackHostname(hostname) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '');
  return host === 'localhost' || host.endsWith('.localhost') ||
    host === '::1' || /^127(?:\.\d{1,3}){3}$/.test(host);
}

window.addEventListener('spotisix:playback-change', event => {
  if (roomRole === 'host' && roomChannel) {
    void sendRoomMessage('playback-state', {
      snapshot: { ...event.detail, audioSrc: getRoomAudioUrl(event.detail?.audioSrc) },
    });
  }
});

function getLocalDisplayName() {
  const name = document.querySelector('.user-name')?.textContent?.trim();
  return name || document.querySelector('.topbar-avatar')?.textContent?.trim() || 'SpotiSix';
}

function getSharedAudioTrackSnapshot() {
  const track = window.getSharedAudioTrack?.();
  if (!track) throw new Error('Không thể lấy thông tin bài hát đang phát.');
  return {
    trackId: track.id || `${track.title}::${track.artist}`,
    title: track.title,
    artist: track.artist,
    album: track.album,
    img: track.img,
    duration: track.duration,
    audioSrc: getRoomAudioUrl(track.audioSrc),
    lrc: track.lrc || '',
    lyrics: track.lyrics || '',
    currentTime: track.currentTime,
    isPlaying: track.isPlaying,
    // Mốc thời gian của máy Host; Guest dùng để bù thời gian truyền trạng thái.
    timestamp: Date.now(),
  };
}

function getHostAudioStream() {
  const track = window.getSharedAudioTrack?.();
  const audio = track?.audioElement;
  if (!track?.audioSrc || !audio?.src) {
    showAppToast('Để tạo phòng nghe chung, hãy phát một bài đã đăng lên thư viện SpotiSix trước khi mời bạn.');
    return null;
  }
  try {
    if (!hostAudioStream) {
      if (typeof audio.captureStream === 'function') {
        hostAudioStream = audio.captureStream();
      } else if (typeof audio.mozCaptureStream === 'function') {
        hostAudioStream = audio.mozCaptureStream();
      } else {
        showAppToast('Trình duyệt này không hỗ trợ truyền âm thanh trực tiếp. Hãy thử Chrome hoặc Firefox.');
        return null;
      }
    }
    if (!hostAudioStream.getAudioTracks().some(track => track.readyState === 'live')) {
      hostAudioStream = null;
      showAppToast('Không lấy được luồng âm thanh của tệp đang phát. Hãy phát lại tệp rồi thử lại.');
      return null;
    }
    return hostAudioStream;
  } catch (error) {
    showAppToast(`Không thể chia sẻ âm thanh: ${error instanceof Error ? error.message : 'lỗi không xác định'}`);
    return null;
  }
}

function prepareHostAudioSharing() {
  const track = window.getSharedAudioTrack?.();
  const audioUrl = getRoomAudioUrl(track?.audioSrc);
  if (!audioUrl) {
    hostAudioStream = null;
    showAppToast('Tệp này chỉ có trên thiết bị của bạn. Hãy chọn bài đã đăng lên thư viện công khai để mọi người nghe được.');
    return false;
  }
  if (isLoopbackHostname(new URL(audioUrl).hostname)) {
    hostAudioStream = null;
    showAppToast('Bạn đang mở SpotiSix bằng localhost. Thiết bị khác không thể tải nhạc từ địa chỉ này; hãy dùng link deploy công khai.');
    return false;
  }

  hostAudioStream = getHostAudioStream();
  return true;
}

async function respondToInvite(invite, accepted) {
  if (!discoveryChannel || !ownSessionKey) return;
  const status = await discoveryChannel.send({
    type: 'broadcast',
    event: 'listen-invite-response',
    payload: {
      inviteId: invite.inviteId,
      targetSessionKey: invite.fromSessionKey,
      fromSessionKey: ownSessionKey,
      accepted,
    },
  });
  if (status !== 'ok') showAppToast(`Không thể gửi phản hồi lời mời (${status || 'Realtime'}).`);
}

async function joinRoom({ roomId: requestedRoomId, role, hostId, hostName }) {
  if (roomChannel) await window.leaveSharedListening();
  const client = window.getNearbySupabaseClient?.();
  if (!client) throw new Error('Đăng nhập và kết nối Supabase trước khi mở phòng nghe chung.');
  if (role === 'host' && !prepareHostAudioSharing()) {
    throw new Error('Bài đang phát chỉ có trên thiết bị của bạn. Hãy chọn bài đã đăng lên thư viện công khai để mọi người nghe được.');
  }

  roomId = requestedRoomId;
  if (role === 'host') pendingRoomId = null;
  roomRole = role;
  roomHostId = hostId || null;
  roomHostName = hostName;
  const channel = client.channel(`spotisix:listen:${requestedRoomId}`, {
    config: { presence: { key: clientId } },
  });
  roomChannel = channel;
  channel.on('presence', { event: 'sync' }, updateRoomBanner);
  channel.on('presence', { event: 'sync' }, () => { void validateRoomDistances(channel); });
  channel.on('presence', { event: 'join' }, () => { void validateRoomDistances(channel); });
  channel.on('presence', { event: 'sync' }, () => {
    if (roomRole === 'host') {
      for (const [key, entries] of Object.entries(channel.presenceState())) {
        if (key === clientId || !entries.some(entry => entry.role === 'guest')) continue;
        void createHostPeerConnection(key);
      }
    }
  });
  channel.on('presence', { event: 'join' }, ({ key }) => {
    if (roomRole === 'host' && key !== clientId) void createHostPeerConnection(key);
  });
  channel.on('presence', { event: 'leave' }, ({ key }) => {
    peerConnections.get(key)?.close();
    peerConnections.delete(key);
    pendingIceCandidates.delete(key);
    updateRoomBanner();
  });
  channel.on('broadcast', { event: 'signal' }, ({ payload }) => {
    if (payload?.targetId === clientId) void handleSignal(payload);
  });
  channel.on('broadcast', { event: 'playback-state' }, ({ payload }) => {
    if (roomRole === 'guest' && payload?.snapshot) {
      window.applySharedPlaybackSnapshot?.(getLatencyAdjustedSnapshot(payload.snapshot));
    }
  });
  channel.on('broadcast', { event: 'room-state' }, ({ payload }) => {
    if (roomRole === 'guest' && payload?.snapshot) {
      window.applySharedPlaybackSnapshot?.(getLatencyAdjustedSnapshot(payload.snapshot));
    }
  });
  channel.on('broadcast', { event: 'clock-ping' }, ({ payload }) => {
    if (roomRole !== 'host' || !payload?.pingId || !Number.isFinite(payload.clientSentAt)) return;
    const hostReceivedAt = Date.now();
    void sendRoomMessage('clock-pong', {
      pingId: payload.pingId,
      targetId: payload.clientId,
      clientSentAt: payload.clientSentAt,
      hostReceivedAt,
      hostSentAt: Date.now(),
    });
  });
  channel.on('broadcast', { event: 'clock-pong' }, ({ payload }) => {
    if (roomRole !== 'guest' || payload?.targetId !== clientId) return;
    const localReceivedAt = Date.now();
    const pending = pendingClockPings.get(payload.pingId);
    if (!pending) return;
    pendingClockPings.delete(payload.pingId);
    const roundTrip = Math.max(0,
      (localReceivedAt - payload.clientSentAt) -
      (payload.hostSentAt - payload.hostReceivedAt));
    const offset = ((payload.hostReceivedAt - payload.clientSentAt) +
      (payload.hostSentAt - localReceivedAt)) / 2;
    // Làm mượt nhiều mẫu để tránh một gói tin bất thường làm đồng hồ nhảy mạnh.
    clockSync.offsetMs = clockSync.samples === 0
      ? offset
      : clockSync.offsetMs * 0.75 + offset * 0.25;
    clockSync.rttMs = clockSync.rttMs === null
      ? roundTrip
      : clockSync.rttMs * 0.75 + roundTrip * 0.25;
    clockSync.samples += 1;
  });
  channel.on('broadcast', { event: 'distance-limit' }, ({ payload }) => {
    if (roomRole === 'guest' && payload?.targetId === clientId) {
      showAppToast('Khoảng cách tới chủ phòng vượt quá 600 km. Bạn đã bị đưa ra khỏi phòng.');
      void window.leaveSharedListening();
    }
  });
  channel.on('broadcast', { event: 'peer-reconnect-request' }, ({ payload }) => {
    if (roomRole !== 'host' || !payload?.guestId || !roomChannel) return;
    const oldConnection = peerConnections.get(payload.guestId);
    if (oldConnection) oldConnection.close();
    peerConnections.delete(payload.guestId);
    pendingIceCandidates.delete(payload.guestId);
    void createHostPeerConnection(payload.guestId);
  });
  try {
    await new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('Kết nối phòng nghe chung hết thời gian chờ.')), 10000);
      channel.subscribe(status => {
        if (status === 'SUBSCRIBED') {
          window.clearTimeout(timeout);
          resolve();
        } else if (['CHANNEL_ERROR', 'TIMED_OUT', 'CLOSED'].includes(status)) {
          window.clearTimeout(timeout);
          reject(new Error(`Không thể kết nối phòng nghe chung (${status}).`));
        }
      });
    });
    // Chỉ xin vị trí khi người dùng thực sự tham gia phòng nghe chung.
    // Tọa độ được gửi trong Presence của phòng, không ghi vào bảng database.
    roomLocation = await getCurrentRoomLocation();
    const trackStatus = await channel.track({
      displayName: getLocalDisplayName(),
      role,
      location: roomLocation,
    });
    if (trackStatus !== 'ok') throw new Error(`Không thể kết nối phòng nghe chung (${trackStatus || 'Realtime'}).`);
    if (role === 'guest') {
      window.setSharedListeningRole?.('guest');
    } else {
      window.setSharedListeningRole?.('host');
      const snapshot = getSharedAudioTrackSnapshot();
      await sendRoomMessage('room-state', { snapshot });
      hostStateTimer = window.setInterval(() => {
        void sendRoomMessage('playback-state', { snapshot: getSharedAudioTrackSnapshot() });
      }, 1200);
    }
    if (role === 'guest') {
      void sendClockPing();
      guestClockTimer = window.setInterval(() => { void sendClockPing(); }, 5000);
    }
    updateRoomBanner();
    await validateRoomDistances(channel);
    if (!roomRole) return; // Guest có thể đã bị từ chối vì vượt quá 600 km.
    showAppToast(role === 'host' ? 'Đã tạo phòng nghe chung.' : `Đã tham gia nghe chung với ${hostName}.`);
  } catch (error) {
    window.clearInterval(hostStateTimer);
    hostStateTimer = null;
    for (const connection of peerConnections.values()) connection.close();
    peerConnections.clear();
    pendingIceCandidates.clear();
    roomChannel = null;
    roomId = null;
    roomRole = null;
    roomHostId = null;
    roomHostName = '';
    hostAudioStream = null;
    roomLocation = null;
    window.clearInterval(guestClockTimer);
    guestClockTimer = null;
    banner.classList.add('hidden');
    window.setSharedListeningRole?.(null);
    try {
      await client.removeChannel(channel);
    } catch (cleanupError) {
      console.error('Could not clean up a failed shared listening room.', cleanupError);
    }
    throw error;
  }
}


function getCurrentRoomLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Trình duyệt không hỗ trợ xác định vị trí; không thể kiểm tra giới hạn 600 km.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
      error => {
        const reason = error.code === 1
          ? 'Bạn chưa cấp quyền vị trí.'
          : error.code === 3
            ? 'Lấy vị trí quá thời gian chờ.'
            : 'Không thể xác định vị trí hiện tại.';
        reject(new Error(`${reason} Cần cho phép vị trí để kiểm tra giới hạn 600 km.`));
      },
      { enableHighAccuracy: false, maximumAge: 60000, timeout: 12000 },
    );
  });
}

function distanceInKm(a, b) {
  const toRad = value => value * Math.PI / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function validateRoomDistances(channel = roomChannel) {
  if (!channel || !roomLocation || distanceCheckInProgress || distanceLimitTriggered) return;
  distanceCheckInProgress = true;
  try {
    const entries = Object.entries(channel.presenceState());
    const hosts = entries.flatMap(([key, values]) =>
      values.filter(value => value.role === 'host' && value.location)
        .map(value => ({ key, location: value.location })));
    const guests = entries.flatMap(([key, values]) =>
      values.filter(value => value.role === 'guest' && value.location)
        .map(value => ({ key, location: value.location })));
    if (roomRole === 'guest') {
      const host = hosts.find(item => item.key !== clientId);
      if (host && distanceInKm(roomLocation, host.location) > 600) {
        distanceLimitTriggered = true;
        showAppToast('Bạn cách chủ phòng hơn 600 km nên không thể tham gia nghe chung.');
        await window.leaveSharedListening();
      }
    } else if (roomRole === 'host') {
      for (const guest of guests) {
        if (guest.key !== clientId && distanceInKm(roomLocation, guest.location) > 600) {
          void sendRoomMessage('distance-limit', { targetId: guest.key });
        }
      }
    }
  } finally {
    distanceCheckInProgress = false;
  }
}

async function sendClockPing() {
  if (roomRole !== 'guest' || !roomChannel) return;
  const pingId = globalThis.crypto?.randomUUID?.() || `ping-${Date.now()}-${Math.random()}`;
  const clientSentAt = Date.now();
  pendingClockPings.set(pingId, { clientSentAt });
  // Dọn ping cũ nếu phản hồi bị mất.
  window.setTimeout(() => pendingClockPings.delete(pingId), 10000);
  await sendRoomMessage('clock-ping', { pingId, clientId, clientSentAt });
}

function getLatencyAdjustedSnapshot(snapshot) {
  if (!snapshot || !Number.isFinite(snapshot.currentTime)) return snapshot;
  const hostNow = Date.now() + clockSync.offsetMs;
  const elapsedSinceSnapshot = Number.isFinite(snapshot.timestamp)
    ? Math.max(0, (hostNow - snapshot.timestamp) / 1000)
    : 0;
  return {
    ...snapshot,
    // Đây là vị trí dự kiến trên timeline của Host, dùng cho giao diện.
    // Âm thanh WebRTC vẫn là luồng liên tục, không thể seek bằng currentTime.
    currentTime: snapshot.isPlaying
      ? snapshot.currentTime + elapsedSinceSnapshot
      : snapshot.currentTime,
    estimatedNetworkRttMs: clockSync.rttMs,
  };
}

async function createHostPeerConnection(remoteClientId) {
  if (peerConnections.has(remoteClientId) || !hostAudioStream || !roomChannel) return;
  const connection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });
  peerConnections.set(remoteClientId, connection);
  hostAudioStream.getTracks().forEach(track => connection.addTrack(track, hostAudioStream));
  connection.onicecandidate = event => {
    if (event.candidate) void sendSignal(remoteClientId, { candidate: event.candidate });
  };
  connection.onconnectionstatechange = () => {
    if (['failed', 'closed'].includes(connection.connectionState)) {
      connection.close();
      if (peerConnections.get(remoteClientId) === connection) {
        peerConnections.delete(remoteClientId);
      }
      pendingIceCandidates.delete(remoteClientId);
      if (connection.connectionState === 'failed') {
        // Tạo lại luồng từ thời điểm hiện tại; Host vẫn đang phát bài gốc.
        window.setTimeout(() => {
          if (roomRole === 'host' && roomChannel) {
            void createHostPeerConnection(remoteClientId);
          }
        }, 1500);
      }
    }
  };
  try {
    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    await sendSignal(remoteClientId, { description: connection.localDescription });
  } catch (error) {
    connection.close();
    peerConnections.delete(remoteClientId);
    showAppToast(`Không thể kết nối âm thanh với người nghe: ${error instanceof Error ? error.message : 'lỗi WebRTC'}`);
  }
}

async function handleSignal(payload) {
  if (roomRole === 'host') {
    const connection = peerConnections.get(payload.fromId);
    if (!connection) return;
    try {
      if (payload.description?.type === 'answer') {
        await connection.setRemoteDescription(payload.description);
        await flushPendingIceCandidates(payload.fromId, connection);
      }
      if (payload.candidate) await addOrQueueIceCandidate(payload.fromId, connection, payload.candidate);
    } catch (error) {
      showAppToast(`Lỗi đồng bộ kết nối âm thanh: ${error instanceof Error ? error.message : 'WebRTC'}`);
    }
    return;
  }
  if (roomRole !== 'guest') return;
  let connection = peerConnections.get(payload.fromId);
  if (!connection || ['failed', 'closed'].includes(connection.connectionState) ||
      (payload.description?.type === 'offer' && connection.remoteDescription)) {
    if (connection) connection.close();
    connection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });
    peerConnections.set(payload.fromId, connection);
    connection.onicecandidate = event => {
      if (event.candidate) void sendSignal(payload.fromId, { candidate: event.candidate });
    };
    connection.ontrack = event => {
      void window.attachSharedAudioStream?.(event.streams[0]);
    };
    connection.onconnectionstatechange = () => {
      if (connection.connectionState === 'failed' && roomRole === 'guest' && roomChannel) {
        peerConnections.delete(payload.fromId);
        pendingIceCandidates.delete(payload.fromId);
        // Yêu cầu Host tạo lại PeerConnection; luồng mới sẽ bắt đầu từ bài đang phát.
        void sendRoomMessage('peer-reconnect-request', { guestId: clientId });
      }
    };
  }
  try {
    if (payload.description?.type === 'offer') {
      await connection.setRemoteDescription(payload.description);
      await flushPendingIceCandidates(payload.fromId, connection);
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      await sendSignal(payload.fromId, { description: connection.localDescription });
    }
    if (payload.candidate) await addOrQueueIceCandidate(payload.fromId, connection, payload.candidate);
  } catch (error) {
    showAppToast(`Không thể nhận âm thanh chung: ${error instanceof Error ? error.message : 'WebRTC'}`);
  }
}

async function addOrQueueIceCandidate(remoteId, connection, candidate) {
  if (!connection.remoteDescription) {
    const candidates = pendingIceCandidates.get(remoteId) || [];
    candidates.push(candidate);
    pendingIceCandidates.set(remoteId, candidates);
    return;
  }
  await connection.addIceCandidate(candidate);
}

async function flushPendingIceCandidates(remoteId, connection) {
  const candidates = pendingIceCandidates.get(remoteId) || [];
  pendingIceCandidates.delete(remoteId);
  for (const candidate of candidates) await connection.addIceCandidate(candidate);
}

async function sendSignal(targetId, signal) {
  if (!roomChannel) return;
  const status = await roomChannel.send({
    type: 'broadcast',
    event: 'signal',
    payload: { ...signal, fromId: clientId, targetId },
  });
  if (status !== 'ok') showAppToast(`Lỗi truyền tín hiệu âm thanh (${status || 'Realtime'}).`);
}

async function sendRoomMessage(event, payload) {
  if (!roomChannel) return;
  const status = await roomChannel.send({ type: 'broadcast', event, payload });
  if (status !== 'ok') showAppToast(`Không thể đồng bộ phòng nghe (${status || 'Realtime'}).`);
}

function updateRoomBanner() {
  if (!roomChannel) return;
  const members = Object.entries(roomChannel.presenceState()).flatMap(([key, entries]) => {
    const entry = entries.find(item => typeof item.displayName === 'string' && item.displayName.trim());
    return entry ? [{ key, name: entry.displayName.trim(), role: entry.role }] : [];
  });
  if (!members.some(member => member.key === clientId)) {
    members.push({ key: clientId, name: getLocalDisplayName(), role: roomRole });
  }
  if (roomRole === 'guest' && !members.some(member => member.role === 'host') && roomHostName) {
    members.push({ key: 'host', name: roomHostName, role: 'host' });
  }
  const names = members.map(member => member.name);
  const memberNames = names.join(', ');
  const roomDescription = memberNames || 'đang chờ người tham gia';
  bannerLabel.textContent = `Đang nghe chung · ${roomDescription}`;
  banner.classList.remove('hidden');
  roomIndicatorMembers.textContent = `${names.length} người · ${roomDescription}`;
  roomIndicator.title = `Phòng nghe chung: ${roomDescription}`;
  roomIndicator.classList.remove('hidden');
  document.body.classList.add('has-shared-listening-room');
  window.dispatchEvent(new CustomEvent('spotisix:shared-room-updated', {
  detail: window.getSharedListeningRoomState?.() || { active: false },
}));
}

window.createSharedListeningRoom = async function createSharedListeningRoom() {
  if (roomChannel && roomRole) {
    throw new Error(
      "Bạn đang ở trong một phòng nghe chung. Hãy rời phòng trước.",
    );
  }
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  const roomCode = Array.from(
    bytes,
    (value) => alphabet[value % alphabet.length],
  ).join("");
  await joinRoom({
    roomId: roomCode,
    role: "host",
    hostId: clientId,
    hostName: getLocalDisplayName(),
  });
  return { roomCode };
};

window.joinSharedListeningRoomByCode =
  async function joinSharedListeningRoomByCode(roomCode) {
    const code = String(roomCode || "")
      .trim()
      .toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) throw new Error("Mã phòng không hợp lệ.");
    if (roomChannel && roomRole)
      throw new Error("Bạn đang ở trong một phòng khác. Hãy rời phòng trước.");
    await joinRoom({
      roomId: code,
      role: "guest",
      hostId: null,
      hostName: "Host",
    });
    return true;
  };

window.getSharedListeningRoomState = function getSharedListeningRoomState() {
  if (!roomChannel || !roomRole || !roomId) return { active: false };
  const members = Object.entries(roomChannel.presenceState()).flatMap(
    ([key, entries]) => {
      const entry = entries.find(
        (item) =>
          typeof item.displayName === "string" && item.displayName.trim(),
      );
      return entry
        ? [
            {
              id: key,
              name: entry.displayName.trim(),
              role: entry.role || (key === clientId ? roomRole : "guest"),
            },
          ]
        : [];
    },
  );
  if (!members.some((member) => member.id === clientId)) {
    members.push({ id: clientId, name: getLocalDisplayName(), role: roomRole });
  }
  return { active: true, roomCode: roomId, role: roomRole, members };
};
