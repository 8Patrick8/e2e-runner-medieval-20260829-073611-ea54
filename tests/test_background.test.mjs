import { test } from 'node:test';
import assert from 'node:assert/strict';

import { createGameState, resetGame } from '../src/game/state.js';
import { updateBackground, drawBackground } from '../src/game/background.js';

function makeCtx(width = 960, height = 540) {
  const calls = [];
  const gradient = { addColorStop() {} };
  const target = {
    calls,
    canvas: { width, height },
    fillStyle: '',
    globalAlpha: 1,
  };
  return new Proxy(target, {
    get(obj, prop) {
      if (prop === 'createLinearGradient' || prop === 'createRadialGradient') {
        return () => gradient;
      }
      if (prop in obj) return obj[prop];
      return (...args) => {
        obj.calls.push([prop, args]);
      };
    },
    set(obj, prop, value) {
      obj[prop] = value;
      return true;
    },
  });
}

test('updateBackground() verschiebt alle Ebenen mit unterschiedlichen Geschwindigkeiten', () => {
  const state = createGameState();
  state.speed = 300;

  updateBackground(state, 1);

  assert.ok(state.bg.nearHills > state.bg.castle);
  assert.ok(state.bg.castle > state.bg.farHills);
  assert.ok(state.bg.farHills > state.bg.clouds);
});

test('updateBackground() akkumuliert die Scroll-Offsets', () => {
  const state = createGameState();
  state.speed = 300;

  updateBackground(state, 0.5);
  const first = state.bg.nearHills;
  updateBackground(state, 0.5);

  assert.ok(state.bg.nearHills > first);
});

test('updateBackground() scrollt proportional zu state.speed', () => {
  const a = createGameState();
  const b = createGameState();
  a.speed = 300;
  b.speed = 600;

  updateBackground(a, 1);
  updateBackground(b, 1);

  assert.ok(Math.abs(b.bg.castle - 2 * a.bg.castle) < 1e-9);
});

test('drawBackground() läuft ohne Fehler und zeichnet mehrere Ebenen', () => {
  const state = createGameState();
  updateBackground(state, 0.25);
  const ctx = makeCtx();

  assert.doesNotThrow(() => drawBackground(ctx, state));

  const arcs = ctx.calls.filter(([name]) => name === 'arc').length;
  const fills = ctx.calls.filter(([name]) => name === 'fill').length;
  assert.ok(arcs > 0, 'zeichnet Bögen für Hügel und Wolken');
  assert.ok(fills >= 4, 'füllt mindestens die vier Ebenen');
});

test('drawBackground() funktioniert auch mit leerem bg (frischer State)', () => {
  const state = createGameState();
  const ctx = makeCtx();
  assert.doesNotThrow(() => drawBackground(ctx, state));
});

test('resetGame() setzt bg zurück; updateBackground initialisiert erneut', () => {
  const state = createGameState();
  updateBackground(state, 1);
  assert.ok(state.bg.nearHills > 0);

  resetGame(state);
  assert.deepEqual(state.bg, {});

  updateBackground(state, 1);
  assert.ok(state.bg.nearHills > 0);
});
