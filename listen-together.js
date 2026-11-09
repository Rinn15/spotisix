/* SpotiSix — Listen Together UI (Sprint 5)
 * Uses the existing shared-listening.js room transport.
 */
(() => {
  'use strict';

  const root = document.getElementById('listen-together-view');
  if (!root) return;

  const $ = (selector) => root.querySelector(selector);
  const createPanel = $('#lt-create-panel');
  const joinPanel = $('#lt-join-panel');
  const roomPanel = $('#lt-room-panel');
  const codeInput = $('#lt-room-code');
  const status = $('#lt-status');
  const memberList = $('#lt-member-list');
  const countLabel = $('#lt-member-count');
  const roomCodeLabel = $('#lt-room-code-label');
  const roomTitle = $('#lt-room-title');
  const trackTitle = $('#lt-track-title');
  const trackArtist = $('#lt-track-artist');
  const trackArt = $('#lt-track-art');
  const roleLabel = $('#lt-role-label');
  const copyCodeButton = $('#lt-copy-code');
  const copyLinkButton = $('#lt-copy-link');

  let activeRoomCode = '';
  let lastMembers = [];

  function notify(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
    status.classList.remove('hidden');
  }

  function setBusy(button, busy, label) {
    if (!button) return;
    if (busy) {
      button.dataset.originalText = button.textContent;
      button.textContent = label || 'Đang xử lý…';
    } else if (button.dataset.originalText) {
      button.textContent = button.dataset.originalText;
      delete button.dataset.originalText;
    }
    button.disabled = busy;
  }

  function showCreateJoin() {
    createPanel.classList.remove('hidden');
    joinPanel.classList.remove('hidden');
    roomPanel.classList.add('hidden');
  }

  function showRoom() {
    createPanel.classList.add('hidden');
    joinPanel.classList.add('hidden');
    roomPanel.classList.remove('hidden');
  }

  function makeInviteUrl(code) {
    const url = new URL(window.location.href);
    url.searchParams.set('room', code);
    url.hash = 'listen-together';
    return url.toString();
  }

  async function copyText(value, successMessage) {
    try {
      await navigator.clipboard.writeText(value);
      notify(successMessage);
    } catch {
      notify('Không thể sao chép tự động. Hãy chọn và sao chép nội dung thủ công.', true);
    }
  }

  function initials(name) {
    return (name || '?').trim().charAt(0).toLocaleUpperCase('vi-VN');
  }

  function renderMembers(members) {
    lastMembers = Array.isArray(members) ? members : [];
    memberList.replaceChildren();

    if (!lastMembers.length) {
      const empty = document.createElement('li');
      empty.className = 'lt-empty-members';
      empty.textContent = 'Đang chờ người tham gia…';
      memberList.append(empty);
    }

    lastMembers.forEach((member) => {
      const item = document.createElement('li');
      item.className = 'lt-member';

      const avatar = document.createElement('span');
      avatar.className = 'lt-avatar';
      avatar.textContent = initials(member.name);
      avatar.setAttribute('aria-hidden', 'true');

      const copy = document.createElement('span');
      copy.className = 'lt-member-copy';

      const name = document.createElement('strong');
      name.textContent = member.name || 'Người nghe';

      const role = document.createElement('small');
      role.textContent = member.role === 'host' ? 'Host' : 'Thành viên';

      copy.append(name, role);

      const presence = document.createElement('span');
      presence.className = 'lt-presence';
      presence.textContent = 'Đang kết nối';
      presence.setAttribute('aria-label', 'Đang kết nối');

      item.append(avatar, copy, presence);
      memberList.append(item);
    });

    countLabel.textContent = `${lastMembers.length}/6 người`;
  }

  function renderTrack() {
    const track = window.getSharedAudioTrack?.();
    if (!track) {
      trackTitle.textContent = 'Chưa có thông tin bài hát';
      trackArtist.textContent = 'Đang chờ dữ liệu phát từ Host';
      trackArt.textContent = '♫';
      return;
    }
    trackTitle.textContent = track.title || 'Đang phát';
    trackArtist.textContent = track.artist || 'SpotiSix';
    trackArt.textContent = '♫';
    if (track.img) {
      trackArt.style.backgroundImage = `url("${String(track.img).replaceAll('"', '')}")`;
      trackArt.classList.add('has-image');
    } else {
      trackArt.style.backgroundImage = '';
      trackArt.classList.remove('has-image');
    }
  }

  function renderRoom(state) {
    if (!state?.active) {
      activeRoomCode = '';
      showCreateJoin();
      return;
    }
    activeRoomCode = state.roomCode || '';
    roomCodeLabel.textContent = activeRoomCode || '------';
    roomTitle.textContent = state.role === 'host' ? 'Phòng của bạn' : 'Phòng nghe chung';
    roleLabel.textContent = state.role === 'host' ? 'Bạn đang là Host' : 'Bạn là thành viên';
    renderMembers(state.members || []);
    renderTrack();
    showRoom();
  }

  async function refreshRoom() {
    const state = window.getSharedListeningRoomState?.();
    if (state) renderRoom(state);
  }

  async function createRoom() {
    const button = $('#lt-create-button');
    setBusy(button, true, 'Đang tạo phòng…');
    try {
      if (typeof window.createSharedListeningRoom !== 'function') {
        throw new Error('Thiếu hàm tạo phòng. Hãy cập nhật shared-listening.js theo hướng dẫn trong gói patch.');
      }
      const result = await window.createSharedListeningRoom();
      activeRoomCode = result.roomCode;
      await refreshRoom();
      notify('Đã tạo phòng. Sao chép mã hoặc link để mời bạn bè.');
    } catch (error) {
      notify(error?.message || 'Không thể tạo phòng nghe chung.', true);
    } finally {
      setBusy(button, false);
    }
  }

  async function joinRoom() {
    const button = $('#lt-join-button');
    const code = codeInput.value.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      notify('Mã phòng phải gồm đúng 6 ký tự chữ hoặc số.', true);
      codeInput.focus();
      return;
    }
    setBusy(button, true, 'Đang tham gia…');
    try {
      if (typeof window.joinSharedListeningRoomByCode !== 'function') {
        throw new Error('Thiếu hàm tham gia bằng mã. Hãy cập nhật shared-listening.js theo hướng dẫn trong gói patch.');
      }
      await window.joinSharedListeningRoomByCode(code);
      activeRoomCode = code;
      await refreshRoom();
      notify('Đã tham gia phòng nghe chung.');
    } catch (error) {
      notify(error?.message || 'Không thể tham gia phòng. Kiểm tra mã và kết nối.', true);
    } finally {
      setBusy(button, false);
    }
  }

  async function leaveRoom() {
    if (!window.confirm('Bạn muốn rời phòng nghe chung?')) return;
    try {
      await window.leaveSharedListening?.();
      activeRoomCode = '';
      showCreateJoin();
      notify('Bạn đã rời phòng nghe chung.');
      const url = new URL(window.location.href);
      url.searchParams.delete('room');
      history.replaceState({}, '', url);
    } catch (error) {
      notify(error?.message || 'Không thể rời phòng.', true);
    }
  }

  $('#lt-create-button').addEventListener('click', createRoom);
  $('#lt-join-button').addEventListener('click', joinRoom);
  codeInput.addEventListener('input', () => {
    codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  });
  codeInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') joinRoom();
  });
  $('#lt-leave-button').addEventListener('click', leaveRoom);
  copyCodeButton.addEventListener('click', () => {
    if (activeRoomCode) void copyText(activeRoomCode, 'Đã sao chép mã phòng.');
  });
  copyLinkButton.addEventListener('click', () => {
    if (activeRoomCode) void copyText(makeInviteUrl(activeRoomCode), 'Đã sao chép link mời.');
  });
  $('#lt-invite-button').addEventListener('click', () => {
    if (typeof window.openNearbyDialog === 'function') window.openNearbyDialog();
    else notify('Chức năng tìm bạn bè online hiện không khả dụng.', true);
  });

  window.addEventListener('spotisix:shared-room-updated', (event) => {
    renderRoom(event.detail);
  });

  // Sidebar navigation uses the existing showView() routing.
  window.openListenTogether = () => {
    window.showView?.('listen-together');
    void refreshRoom();
  };

  // Deep link only pre-fills the code. The user must explicitly join.
  const params = new URLSearchParams(window.location.search);
  const inviteCode = params.get('room');
  if (inviteCode && /^[A-Z0-9]{6}$/i.test(inviteCode)) {
    codeInput.value = inviteCode.toUpperCase();
    notify('Bạn được mời tham gia phòng. Nhấn “Tham gia” để tiếp tục.');
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) void refreshRoom();
  });
  window.setInterval(() => {
    if (!roomPanel.classList.contains('hidden')) void refreshRoom();
  }, 2500);

  showCreateJoin();
})();
