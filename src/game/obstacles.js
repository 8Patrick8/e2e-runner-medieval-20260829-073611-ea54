import {
  SPAWN_GAP_MIN,
  SPAWN_GAP_MAX,
  BARREL_W,
  BARREL_H,
  FENCE_W,
  FENCE_H,
  GROUND_Y,
  COLORS,
} from './constants.js';

const LOGICAL_WIDTH = 960;

let spawnDistance = 0;
let nextSpawnGap = randomGap();
let lastPhase = null;
let canvasWidth = LOGICAL_WIDTH;

function randomGap() {
  return SPAWN_GAP_MIN + Math.random() * (SPAWN_GAP_MAX - SPAWN_GAP_MIN);
}

function makeObstacle(type, x) {
  if (type === 'fence') {
    return { type, x, y: GROUND_Y - FENCE_H, w: FENCE_W, h: FENCE_H };
  }
  return { type: 'barrel', x, y: GROUND_Y - BARREL_H, w: BARREL_W, h: BARREL_H };
}

export function updateObstacles(state, dt) {
  if (lastPhase !== 'playing' && state.phase === 'playing') {
    spawnDistance = 0;
    nextSpawnGap = randomGap();
  }
  lastPhase = state.phase;

  if (state.phase !== 'playing') {
    return;
  }

  for (let i = state.obstacles.length - 1; i >= 0; i--) {
    const ob = state.obstacles[i];
    ob.x -= state.speed * dt;
    if (ob.x + ob.w < 0) {
      state.obstacles.splice(i, 1);
    }
  }

  spawnDistance += state.speed * dt;
  while (spawnDistance >= nextSpawnGap) {
    spawnDistance -= nextSpawnGap;
    nextSpawnGap = randomGap();
    const type = Math.random() < 0.5 ? 'barrel' : 'fence';
    const w = type === 'barrel' ? BARREL_W : FENCE_W;
    state.obstacles.push(makeObstacle(type, canvasWidth + w + 4));
  }
}

function drawBarrel(ctx, ob) {
  const { x, y, w, h } = ob;
  const inset = 4;

  const bodyPath = () => {
    ctx.beginPath();
    ctx.moveTo(x + inset, y);
    ctx.lineTo(x + w - inset, y);
    ctx.lineTo(x + w, y + 6);
    ctx.lineTo(x + w, y + h - 6);
    ctx.lineTo(x + w - inset, y + h);
    ctx.lineTo(x + inset, y + h);
    ctx.lineTo(x, y + h - 6);
    ctx.lineTo(x, y + 6);
    ctx.closePath();
  };

  bodyPath();
  ctx.fillStyle = COLORS.wood;
  ctx.fill();

  ctx.fillStyle = COLORS.woodDark;
  ctx.fillRect(x + 7, y + 4, 2, h - 8);
  ctx.fillRect(x + 13, y + 2, 2, h - 4);
  ctx.fillRect(x + 19, y + 4, 2, h - 8);

  ctx.fillStyle = COLORS.woodLight;
  ctx.fillRect(x + 2, y + 6, 3, h - 12);

  ctx.fillStyle = COLORS.steel;
  ctx.fillRect(x + 1, y + 7, w - 2, 3);
  ctx.fillRect(x + 1, y + h - 10, w - 2, 3);

  bodyPath();
  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawFence(ctx, ob) {
  const { x, y, w, h } = ob;

  ctx.fillStyle = COLORS.wood;
  ctx.fillRect(x, y + 6, w, 6);
  ctx.fillRect(x, y + h - 12, w, 6);

  ctx.fillStyle = COLORS.woodLight;
  ctx.fillRect(x, y + 6, w, 2);
  ctx.fillRect(x, y + h - 12, w, 2);

  ctx.fillStyle = COLORS.woodDark;
  ctx.fillRect(x, y + 10, w, 2);
  ctx.fillRect(x, y + h - 8, w, 2);

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 1, y + 7, w - 2, 4);
  ctx.strokeRect(x + 1, y + h - 11, w - 2, 4);

  const postW = 8;
  const posts = [x, x + w - postW];
  for (const px of posts) {
    ctx.beginPath();
    ctx.moveTo(px, y + h);
    ctx.lineTo(px, y + 4);
    ctx.lineTo(px + postW / 2, y);
    ctx.lineTo(px + postW, y + 4);
    ctx.lineTo(px + postW, y + h);
    ctx.closePath();
    ctx.fillStyle = COLORS.wood;
    ctx.fill();

    ctx.fillStyle = COLORS.woodLight;
    ctx.fillRect(px + 2, y + 6, 2, h - 8);

    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

export function drawObstacles(ctx, state) {
  if (ctx.canvas && typeof ctx.canvas.width === 'number') {
    canvasWidth = ctx.canvas.width;
  }

  for (const ob of state.obstacles) {
    if (ob.type === 'barrel') {
      drawBarrel(ctx, ob);
    } else {
      drawFence(ctx, ob);
    }
  }
}
