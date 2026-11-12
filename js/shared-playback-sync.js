(function exposeSharedPlaybackSync(global) {
  function getSharedPlaybackCorrection(driftSeconds, isPlaying, allowSeek = false) {
    const drift = Number.isFinite(driftSeconds) ? driftSeconds : 0;
    const absoluteDrift = Math.abs(drift);

    if (!isPlaying) {
      return { seek: absoluteDrift > 0.75, playbackRate: 1 };
    }
    if (allowSeek && absoluteDrift > 0.75) {
      return { seek: true, playbackRate: 1 };
    }
    return {
      seek: false,
      playbackRate: Math.max(0.92, Math.min(1.08, 1 + drift * 0.035)),
    };
  }

  global.getSharedPlaybackCorrection = getSharedPlaybackCorrection;
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = getSharedPlaybackCorrection;
  }
})(globalThis);
