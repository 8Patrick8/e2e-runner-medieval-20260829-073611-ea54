import { test } from 'node:test';
import assert from 'node:assert/strict';

import { START_SPEED, MAX_SPEED, SPEED_ACCEL } from '../src/game/constants.js';
import { createGameState } from '../src/game/state.js';
import { updateGameplay } from '../src/game/gameplay.js';

test('updateGameplay() erhöht Distanz und setzt Score auf Math.floor(Distanz)', () => {
  const state = createGameState();
  state.phase = 'playing';

  updateGameplay(state, 1);

  assert.strictEqual(state.distance, START_SPEED);
  assert.strictEqual(state.score, Math.floor(START_SPEED));
});

test('updateGameplay() steigert die Geschwindigkeit kontinuierlich', () => {
  const state = createGameState();
  state.phase = 'playing';

  const before = state.speed;
  updateGameplay(state, 1);

  assert.ok(state.speed > before);
  assert.strictEqual(state.speed, START_SPEED + SPEED_ACCEL);
});

test('updateGameplay() begrenzt die Geschwindigkeit auf MAX_SPEED', () => {
  const state = createGameState();
  state.phase = 'playing';
  state.speed = MAX_SPEED - SPEED_ACCEL / 2;

  updateGameplay(state, 1);

  assert.ok(state.speed <= MAX_SPEED);
  assert.strictEqual(state.speed, MAX_SPEED);
});

test('updateGameplay() hebt den Highscore an, wenn der Score ihn übersteigt', () => {
  const state = createGameState();
  state.phase = 'playing';
  state.highscore = 5;

  updateGameplay(state, 1);

  assert.strictEqual(state.highscore, state.score);
  assert.ok(state.highscore > 5);
});

test('updateGameplay() tut nichts außerhalb der phase "playing"', () => {
  const state = createGameState();
  state.phase = 'menu';
  const snapshot = { ...state, player: { ...state.player } };

  updateGameplay(state, 1);

  assert.strictEqual(state.distance, snapshot.distance);
  assert.strictEqual(state.score, snapshot.score);
  assert.strictEqual(state.speed, snapshot.speed);
  assert.strictEqual(state.highscore, snapshot.highscore);
});
