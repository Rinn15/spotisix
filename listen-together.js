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
  const roomDialog = document.getElementById('room-dialog');
  const roomDialogIdle = document.getElementById('room-dialog-idle');
  const roomDialogActive = document.getElementById('room-dialog-active');
  const roomDialogCreateButton = document.getElementById('room-dialog-create-btn');
  const roomDialogJoinInput = document.getElementById('room-dialog-join-input');
  const roomDialogCode = document.getElementById('room-dialog-code-value');
  const roomDialogLink = document.getElementById('room-dialog-link-input');
  const roomDialogRole = document.getElementById('room-dialog-role-badge');
  const roomDialogMembers = document.getElementById('room-dialog-members-list');
  const roomDialogMemberCount = document.getElementById('room-dialog-member-count');
  const roomDialogTrackTitle = document.getElementById('room-dialog-track-title');
  const roomDialogTrackArtist = document.getElementById('room-dialog-track-artist');
  const roomDialogTrackImage = document.getElementById('room-dialog-track-img');
  const roomDialogTrackStatus = document.getElementById('room-dialog-track-status');
  const roomDialogFeedback = document.getElementById('room-dialog-feedback');

  let activeRoomCode = '';
  let lastMembers = [];

  function notify(message, isError = false) {
    status.textContent = message;
    status.classList.toggle('is-error', isError);
    status.classList.remove('hidden');
  }

  function notifyRoomDialog(message, isError = false) {
    notify(message, isError);
    roomDialogFeedback.textContent = message;
    roomDialogFeedback.classList.toggle('is-error', isError);
    roomDialogFeedback.classList.remove('hidden');
    if (!roomDialog.open) window.showAppToast?.(message);
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

  function renderRoomDialogTrack() {
    const track = window.getSharedAudioTrack?.();
    roomDialogTrackTitle.textContent = track?.title || 'Chưa phát nhạc';
    roomDialogTrackArtist.textContent = track?.artist || 'SpotiSix';
    if (track?.img) roomDialogTrackImage.src = track.img;
    roomDialogTrackStatus.classList.toggle('playing', Boolean(track?.isPlaying));
    roomDialogTrackStatus.querySelector('span').textContent = track?.isPlaying ? 'Đang phát' : 'Đang tạm dừng';
  }

  function renderRoomDialog(state = window.getSharedListeningRoomState?.()) {
    const isActive = Boolean(state?.active);
    roomDialogIdle.classList.toggle('hidden', isActive);
    roomDialogActive.classList.toggle('hidden', !isActive);

    const topbarButton = document.getElementById('topbar-room-btn');
    const topbarButtonText = document.getElementById('topbar-room-btn-text');
    topbarButton?.classList.toggle('in-room', isActive);
    if (topbarButtonText) topbarButtonText.textContent = isActive ? 'Phòng của tôi' : 'Tạo phòng';
    if (topbarButton) {
      topbarButton.setAttribute('aria-label', isActive ? 'Mở phòng nghe chung hiện tại' : 'Tạo phòng nghe nhạc cùng bạn bè');
      topbarButton.title = isActive ? 'Mở phòng nghe chung' : 'Tạo phòng nghe chung';
    }

    if (!isActive) return;

    const code = state.roomCode || '';
    const members = Array.isArray(state.members) ? state.members : [];
    roomDialogCode.textContent = code || '------';
    roomDialogLink.value = code ? makeInviteUrl(code) : '';
    roomDialogRole.textContent = state.role === 'host' ? 'Host' : 'Thành viên';
    roomDialogRole.classList.toggle('is-host', state.role === 'host');
    roomDialogMemberCount.textContent = `${members.length}/6 người`;
    roomDialogMembers.replaceChildren();

    members.forEach(member => {
      const item = document.createElement('li');
      item.className = 'room-dialog-member-item';
      const avatar = document.createElement('span');
      avatar.className = 'room-member-avatar';
      avatar.textContent = initials(member.name);
      const info = document.createElement('span');
      info.className = 'room-member-info';
      const name = document.createElement('span');
      name.className = 'room-member-name';
      name.textContent = member.name || 'Người nghe';
      const role = document.createElement('span');
      role.className = 'room-member-role-tag';
      role.textContent = member.role === 'host' ? 'Host' : 'Thành viên';
      const dot = document.createElement('span');
      dot.className = 'room-member-dot';
      info.append(name, role);
      item.append(avatar, info, dot);
      roomDialogMembers.append(item);
    });

    renderRoomDialogTrack();
  }

  window.openRoomDialog = function openRoomDialog() {
    renderRoomDialog();
    roomDialogFeedback.classList.add('hidden');
    if (!roomDialog.open) roomDialog.showModal();
  };

  window.closeRoomDialog = function closeRoomDialog() {
    if (roomDialog.open) roomDialog.close();
  };

  async function copyRoomDialogText(value, successMessage) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      notifyRoomDialog(successMessage);
    } catch (error) {
      console.error('Không thể sao chép thông tin phòng.', error);
      notifyRoomDialog('Không thể sao chép tự động. Hãy chọn và sao chép nội dung thủ công.', true);
    }
  }

  window.copyRoomDialogCode = () => copyRoomDialogText(roomDialogCode.textContent, 'Đã sao chép mã phòng.');
  window.copyRoomDialogLink = () => copyRoomDialogText(roomDialogLink.value, 'Đã sao chép link mời.');

  window.handleDialogCreateRoom = async function handleDialogCreateRoom() {
    setBusy(roomDialogCreateButton, true, 'Đang tạo phòng…');
    try {
      if (typeof window.createSharedListeningRoom !== 'function') {
        throw new Error('Chức năng tạo phòng hiện không khả dụng.');
      }
      await window.createSharedListeningRoom();
      renderRoomDialog();
      notifyRoomDialog('Đã tạo phòng. Sao chép mã hoặc link để mời bạn bè.');
    } catch (error) {
      notifyRoomDialog(error?.message || 'Không thể tạo phòng nghe chung.', true);
    } finally {
      setBusy(roomDialogCreateButton, false);
    }
  };

  window.handleDialogJoinRoom = async function handleDialogJoinRoom() {
    const code = roomDialogJoinInput.value.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(code)) {
      notifyRoomDialog('Mã phòng phải gồm đúng 6 ký tự chữ hoặc số.', true);
      roomDialogJoinInput.focus();
      return;
    }
    const joinButton = roomDialogJoinInput.parentElement.querySelector('button');
    setBusy(joinButton, true, 'Đang tham gia…');
    try {
      await window.joinSharedListeningRoomByCode(code);
      renderRoomDialog();
      notifyRoomDialog('Đã tham gia phòng nghe chung.');
    } catch (error) {
      notifyRoomDialog(error?.message || 'Không thể tham gia phòng. Kiểm tra mã và kết nối.', true);
    } finally {
      setBusy(joinButton, false);
    }
  };

  window.handleDialogLeaveRoom = async function handleDialogLeaveRoom() {
    if (!window.confirm('Bạn muốn rời phòng nghe chung?')) return;
    try {
      await window.leaveSharedListening?.();
      roomDialogJoinInput.value = '';
      renderRoomDialog();
      notifyRoomDialog('Bạn đã rời phòng nghe chung.');
    } catch (error) {
      notifyRoomDialog(error?.message || 'Không thể rời phòng.', true);
    }
  };

  roomDialogJoinInput.addEventListener('input', () => {
    roomDialogJoinInput.value = roomDialogJoinInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  });
  roomDialogJoinInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') window.handleDialogJoinRoom();
  });

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
    renderRoomDialog(event.detail);
  });
  window.addEventListener('spotisix:playback-change', renderRoomDialogTrack);
  window.addEventListener('spotisix:shared-playback-updated', renderRoomDialogTrack);
  window.addEventListener('spotisix:track-change', renderRoomDialogTrack);

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
