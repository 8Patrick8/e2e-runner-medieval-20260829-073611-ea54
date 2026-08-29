import { test } from 'node:test';
import assert from 'node:assert/strict';

import { GROUND_Y, GRAVITY, JUMP_VELOCITY } from '../src/game/constants.js';
import { createGameState } from '../src/game/state.js';
import { updatePlayer, jump, drawPlayer } from '../src/game/player.js';

test('jump() hebt den Ritter nur vom Boden ab', () => {
  const state = createGameState();
  jump(state);
  assert.strictEqual(state.player.vy, JUMP_VELOCITY);
  assert.ok(state.player.vy < 0);
  assert.strictEqual(state.player.onGround, false);
});

test('jump() in der Luft ist wirkungslos (kein Doppelsprung)', () => {
  const state = createGameState();
  jump(state);
  const vyAfterFirst = state.player.vy;
  jump(state);
  assert.strictEqual(state.player.vy, vyAfterFirst);
});

test('updatePlayer() wendet Schwerkraft an und lässt den Ritter auf GROUND_Y landen', () => {
  const state = createGameState();
  jump(state);

  const before = state.player.vy;
  updatePlayer(state, 1 / 60);
  assert.ok(state.player.vy > before, 'Schwerkraft erhöht vy');

  for (let i = 0; i < 500; i++) {
    updatePlayer(state, 1 / 60);
  }
  assert.strictEqual(state.player.y, GROUND_Y - state.player.h);
  assert.strictEqual(state.player.onGround, true);
  assert.strictEqual(state.player.vy, 0);
});

test('updatePlayer() zählt runFrame nur am Boden weiter', () => {
  const state = createGameState();
  const before = state.player.runFrame;
  updatePlayer(state, 1 / 60);
  assert.ok(state.player.runFrame > before, 'runFrame läuft am Boden weiter');

  jump(state);
  const inAir = state.player.runFrame;
  updatePlayer(state, 1 / 60);
  assert.strictEqual(state.player.runFrame, inAir, 'runFrame bleibt in der Luft stehen');
});

test('drawPlayer() zeichnet den Ritter ohne Fehler', () => {
  const state = createGameState();
  const calls = [];
  const ctx = {
    _fillStyle: '',
    set fillStyle(v) {
      this._fillStyle = v;
    },
    get fillStyle() {
      return this._fillStyle;
    },
    fillRect(x, y, w, h) {
      calls.push([x, y, w, h]);
    },
  };
  assert.doesNotThrow(() => drawPlayer(ctx, state));
  assert.ok(calls.length > 0, 'mindestens ein Zeichenaufruf');
});
