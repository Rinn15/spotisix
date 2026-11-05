const test = require('node:test');
const assert = require('node:assert/strict');

const storage = new Map();
global.localStorage = {
  getItem: key => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: key => storage.delete(key),
  clear: () => storage.clear(),
};

let songs = [];
global.document = {
  getElementById: () => null,
  querySelector: () => null,
};
global.window = {
  getSpotiSixSongs: () => songs,
  getSpotiSixCurrentIndex: () => -1,
  getSpotiSixUserKey: () => 'recommendation-tests',
  addEventListener: () => {},
};

require('../js/recommendation.js');
const recommendations = window.SpotisixRecommendations;

function track(id, artist, genre = 'indie') {
  return { id, title: `Track ${id}`, artist, genre, tags: [genre] };
}

function ranked(trackList) {
  return trackList.map((item, index) => ({ track: item, index, score: trackList.length - index }));
}

test.beforeEach(() => {
  storage.clear();
  songs = [];
});

test('Repeat Filter removes duplicate tracks while retaining first ranked instance', () => {
  const first = track('one', 'Artist');
  const duplicate = { ...first, id: 'alternate-id' };
  const second = track('two', 'Artist');

  const result = recommendations.applyRepeatFilter(ranked([first, duplicate, second]));

  assert.deepEqual(result.map(item => item.track.id), ['one', 'two']);
});

test('Diversity filter enforces artist and genre caps', () => {
  const candidates = [
    ...Array.from({ length: 3 }, (_, index) => track(`a-${index}`, 'Artist A', 'indie')),
    ...Array.from({ length: 3 }, (_, index) => track(`b-${index}`, 'Artist B', 'jazz')),
    ...Array.from({ length: 3 }, (_, index) => track(`c-${index}`, 'Artist C', 'rock')),
    ...Array.from({ length: 3 }, (_, index) => track(`d-${index}`, 'Artist D', 'folk')),
  ];

  const selected = recommendations.applyDiversityFilter(ranked(candidates), { limit: 8 });
  const byArtist = new Map();
  const byGenre = new Map();
  selected.forEach(({ track: item }) => {
    byArtist.set(item.artist, (byArtist.get(item.artist) || 0) + 1);
    byGenre.set(item.genre, (byGenre.get(item.genre) || 0) + 1);
  });

  assert.equal(selected.length, 8);
  assert.ok([...byArtist.values()].every(count => count <= 2));
  assert.ok([...byGenre.values()].every(count => count <= 3));
});

test('Smart Recommendation keeps its song records after diversity selection', () => {
  const first = track('smart-1', 'Artist A', 'indie');
  const second = track('smart-2', 'Artist B', 'jazz');

  const selected = recommendations.getDiverseRanked([
    { index: 0, song: first, score: 10 },
    { index: 1, song: second, score: 8 },
  ]);

  assert.deepEqual(selected.map(item => item.song.id), ['smart-1', 'smart-2']);
  assert.deepEqual(selected.map(item => item.index), [0, 1]);
});

test('cooldown excludes recently recommended tracks but falls back when necessary', () => {
  const now = Date.now();
  const first = track('recent', 'Artist A', 'indie');
  const second = track('fresh', 'Artist B', 'jazz');
  const logKey = 'spotisix.recommendationLog.v1:recommendation-tests';
  storage.set(logKey, JSON.stringify({
    'song:track recent::artist a': now,
    'song:track fresh::artist b': now,
  }));

  const fullyCoolingDown = recommendations.applyDiversityFilter(ranked([first, second]), {
    now,
    limit: 2,
  });
  assert.equal(fullyCoolingDown.length, 2);

  const fresh = track('fresh-2', 'Artist C', 'rock');
  const withAlternative = recommendations.applyDiversityFilter(ranked([first, second, fresh]), {
    now,
    limit: 1,
  });
  assert.deepEqual(withAlternative.map(item => item.track.id), ['fresh-2']);

  const afterWindow = recommendations.applyDiversityFilter(ranked([first]), {
    now: now + 25 * 60 * 60 * 1000,
    limit: 1,
  });
  assert.equal(afterWindow[0].track.id, 'recent');
});

test('recently played tracks receive a penalty in personalized ranking', () => {
  const recentlyPlayed = track('recent-play', 'Artist A', 'indie');
  const olderPlay = track('older-play', 'Artist B', 'jazz');
  songs = [recentlyPlayed, olderPlay];
  const historyKey = 'spotisix.recommendationHistory.v1:recommendation-tests';
  storage.set(historyKey, JSON.stringify({
    'id:recent-play': { ...recentlyPlayed, playCount: 1, lastPlayed: Date.now() },
    'id:older-play': { ...olderPlay, playCount: 1, lastPlayed: Date.now() - 48 * 60 * 60 * 1000 },
  }));

  const result = recommendations.getRecommendations();

  assert.equal(result.ranked[0].track.id, 'older-play');
});

test('Recommendation Log API writes source-aware snapshots and loads the time window', async () => {
  const loggedPayloads = [];
  const recentTrack = track('server-recent', 'Server Artist', 'ambient');
  const client = {
    auth: {
      getSession: async () => ({
        data: { session: { user: { id: 'user-1' }, access_token: 'real-session' } },
        error: null,
      }),
    },
    from: table => {
      assert.equal(table, 'recommendation_logs');
      return {
        insert: async payload => {
          loggedPayloads.push(payload);
          return { error: null };
        },
        select() { return this; },
        eq() { return this; },
        gte() { return this; },
        order() { return this; },
        range: async (start, end) => {
          assert.equal(start, 0);
          assert.equal(end, 99);
          return {
            data: [{
              created_at: new Date().toISOString(),
              recommendations: [{
                track_key: 'song:track server-recent::server artist',
                title: recentTrack.title,
                artist: recentTrack.artist,
              }],
            }],
            error: null,
          };
        },
      };
    },
  };
  window.getSpotiSixSupabaseClient = () => client;

  await recommendations.logRecommendations('refresh', [{ track: recentTrack, index: 0, score: 1 }], 'player');
  await recommendations.loadRecommendationHistory();

  assert.equal(loggedPayloads.length, 1);
  assert.equal(loggedPayloads[0].source, 'player');
  assert.equal(loggedPayloads[0].event_type, 'refresh');
  assert.equal(loggedPayloads[0].recommendations[0].track_key, 'song:track server-recent::server artist');

  const alternative = track('server-fresh', 'Another Artist', 'jazz');
  const selected = recommendations.applyDiversityFilter(ranked([recentTrack, alternative]), { limit: 1 });
  assert.equal(selected[0].track.id, 'server-fresh');

  window.getSpotiSixSupabaseClient = () => ({
    auth: { getSession: async () => ({ data: { session: null }, error: null }) },
  });
  await recommendations.loadRecommendationHistory();
  delete window.getSpotiSixSupabaseClient;
});

test('refresh rotates to a new batch and applies the time-window exclusion', async () => {
  songs = Array.from({ length: 20 }, (_, index) => track(`refresh-${index}`, `Artist ${index}`, `genre-${index}`));
  const initial = recommendations.getRecommendations().ranked.map(item => item.track.id);

  const firstRefresh = (await recommendations.refresh({ source: 'test' })).map(item => item.track.id);
  const secondRefresh = (await recommendations.refresh({ source: 'test' })).map(item => item.track.id);

  assert.equal(initial.length, 8);
  assert.equal(firstRefresh.length, 8);
  assert.equal(secondRefresh.length, 8);
  assert.equal(new Set(firstRefresh).size, firstRefresh.length);
  assert.equal(new Set(secondRefresh).size, secondRefresh.length);
  assert.equal(firstRefresh.some(id => secondRefresh.includes(id)), false);
});
