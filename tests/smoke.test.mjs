import { test } from 'node:test';
import assert from 'node:assert/strict';

import { GROUND_Y } from '../src/game/constants.js';
import { createGameState, resetGame } from '../src/game/state.js';

test('GROUND_Y ist eine endliche Zahl', () => {
  assert.strictEqual(typeof GROUND_Y, 'number');
  assert.ok(Number.isFinite(GROUND_Y));
});

test('createGameState() liefert die Felder phase, player und score', () => {
  const state = createGameState();
  assert.strictEqual(typeof state.phase, 'string');
  assert.ok('player' in state);
  assert.ok('score' in state);
  assert.strictEqual(state.score, 0);
  assert.ok(Array.isArray(state.obstacles));
});

test('resetGame() setzt Spielwerte zurück und behält den highscore', () => {
  const state = createGameState();
  state.score = 42;
  state.distance = 999;
  state.speed = 999;
  state.highscore = 777;
  state.player.onGround = false;
  state.player.vy = -5;
  state.obstacles.push({ type: 'barrel', x: 0, y: 0, w: 0, h: 0 });

  resetGame(state);

  assert.strictEqual(state.score, 0);
  assert.strictEqual(state.distance, 0);
  assert.strictEqual(state.obstacles.length, 0);
  assert.strictEqual(state.player.onGround, true);
  assert.strictEqual(state.player.vy, 0);
  assert.strictEqual(state.highscore, 777);
});
