import { test } from 'node:test';
import assert from 'node:assert/strict';

import { updateObstacles } from '../src/game/obstacles.js';
import { createGameState } from '../src/game/state.js';
import { GROUND_Y, BARREL_W, BARREL_H, FENCE_W, FENCE_H } from '../src/game/constants.js';

function playingState() {
  const state = createGameState();
  state.phase = 'menu';
  updateObstacles(state, 0);
  state.phase = 'playing';
  state.speed = 300;
  return state;
}

test('updateObstacles bewegt Hindernisse mit state.speed * dt nach links', () => {
  const state = playingState();
  state.obstacles = [{ type: 'barrel', x: 500, y: GROUND_Y - BARREL_H, w: BARREL_W, h: BARREL_H }];

  updateObstacles(state, 0.1);

  assert.strictEqual(state.obstacles.length, 1);
  assert.ok(Math.abs(state.obstacles[0].x - 470) < 1e-6);
});

test('updateObstacles entfernt Hindernisse links außerhalb des Rands', () => {
  const state = playingState();
  state.obstacles = [{ type: 'fence', x: -40, y: GROUND_Y - FENCE_H, w: FENCE_W, h: FENCE_H }];

  updateObstacles(state, 0.1);

  assert.strictEqual(state.obstacles.length, 0);
});

test('updateObstacles erzeugt in phase playing Hindernisse vom Typ barrel oder fence', () => {
  const state = playingState();
  state.speed = 300;

  updateObstacles(state, 20);

  assert.ok(state.obstacles.length >= 1);
  for (const ob of state.obstacles) {
    assert.ok(ob.type === 'barrel' || ob.type === 'fence');
    assert.ok(ob.x > 900);
    if (ob.type === 'barrel') {
      assert.strictEqual(ob.y, GROUND_Y - BARREL_H);
      assert.strictEqual(ob.w, BARREL_W);
      assert.strictEqual(ob.h, BARREL_H);
    } else {
      assert.strictEqual(ob.y, GROUND_Y - FENCE_H);
      assert.strictEqual(ob.w, FENCE_W);
      assert.strictEqual(ob.h, FENCE_H);
    }
  }
});

test('updateObstacles erzeugt und bewegt außerhalb von playing nichts', () => {
  const state = createGameState();
  state.phase = 'menu';
  state.obstacles = [{ type: 'barrel', x: 500, y: GROUND_Y - BARREL_H, w: BARREL_W, h: BARREL_H }];

  updateObstacles(state, 10);

  assert.strictEqual(state.obstacles.length, 1);
  assert.strictEqual(state.obstacles[0].x, 500);
});
