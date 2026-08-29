import { test } from 'node:test';
import assert from 'node:assert/strict';

import { loadHighscore, saveHighscore } from '../src/game/highscore.js';

const KEY = 'medieval-runner-highscore';

function createStorage() {
  const data = new Map();
  const storage = {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  };
  return { data, storage };
}

test('loadHighscore() returns 0 when nothing is stored', () => {
  globalThis.localStorage = createStorage().storage;
  assert.strictEqual(loadHighscore(), 0);
});

test('saveHighscore() stores a finite number under the fixed key and nothing else', () => {
  const { data, storage } = createStorage();
  globalThis.localStorage = storage;

  saveHighscore(1234);

  assert.strictEqual(data.size, 1);
  assert.strictEqual(data.get(KEY), '1234');
});

test('loadHighscore() returns the stored number', () => {
  const { data, storage } = createStorage();
  globalThis.localStorage = storage;

  saveHighscore(42.5);

  assert.strictEqual(loadHighscore(), 42.5);
});

test('saveHighscore() ignores non-finite values', () => {
  const { data, storage } = createStorage();
  globalThis.localStorage = storage;

  saveHighscore(NaN);
  saveHighscore(Infinity);
  saveHighscore(-Infinity);

  assert.strictEqual(data.size, 0);
  assert.strictEqual(loadHighscore(), 0);
});

test('saveHighscore() ignores non-number values', () => {
  const { data, storage } = createStorage();
  globalThis.localStorage = storage;

  saveHighscore('99');
  saveHighscore(null);
  saveHighscore(undefined);

  assert.strictEqual(data.size, 0);
});

test('loadHighscore() treats a non-numeric stored value as 0', () => {
  const { data, storage } = createStorage();
  globalThis.localStorage = storage;
  data.set(KEY, 'not-a-number');

  assert.strictEqual(loadHighscore(), 0);
});

test('loadHighscore() falls back to 0 when storage is unavailable', () => {
  delete globalThis.localStorage;
  assert.strictEqual(loadHighscore(), 0);
});
