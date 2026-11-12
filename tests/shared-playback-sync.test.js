const test = require('node:test');
const assert = require('node:assert/strict');

const getSharedPlaybackCorrection = require('../js/shared-playback-sync.js');

test('small playback drift is corrected smoothly without seeking', () => {
  assert.deepEqual(getSharedPlaybackCorrection(0.5, true), {
    seek: false,
    playbackRate: 1.0175,
  });
  assert.deepEqual(getSharedPlaybackCorrection(-0.5, true), {
    seek: false,
    playbackRate: 0.9825,
  });
});

test('large drift from periodic snapshots is corrected without seeking', () => {
  assert.deepEqual(getSharedPlaybackCorrection(2, true), {
    seek: false,
    playbackRate: 1.07,
  });
  assert.deepEqual(getSharedPlaybackCorrection(8, true), {
    seek: false,
    playbackRate: 1.08,
  });
  assert.deepEqual(getSharedPlaybackCorrection(-8, true), {
    seek: false,
    playbackRate: 0.92,
  });
});

test('explicit playback changes seek while paused snapshots restore position', () => {
  assert.deepEqual(getSharedPlaybackCorrection(3.1, true, true), {
    seek: true,
    playbackRate: 1,
  });
  assert.deepEqual(getSharedPlaybackCorrection(1, false), {
    seek: true,
    playbackRate: 1,
  });
  assert.deepEqual(getSharedPlaybackCorrection(0.5, false), {
    seek: false,
    playbackRate: 1,
  });
});
