import { COLORS, GROUND_Y } from './constants.js';

const PARALLAX = {
  clouds: 0.08,
  farHills: 0.15,
  castle: 0.25,
  nearHills: 0.35,
};

const CLOUD_PATTERN = 900;
const FAR_HILL_PATTERN = 320;
const NEAR_HILL_PATTERN = 420;
const CASTLE_PATTERN = 420;

const FAR_HILL_RADII = [0.5, 0.3, 0.2];
const NEAR_HILL_RADII = [0.3, 0.45, 0.25];

const CLOUDS = [
  { x: 100, y: 60, w: 150 },
  { x: 450, y: 160, w: 120 },
  { x: 720, y: 90, w: 110 },
];

function ensureBg(state) {
  if (typeof state.bg.clouds !== 'number') state.bg.clouds = 0;
  if (typeof state.bg.farHills !== 'number') state.bg.farHills = 0;
  if (typeof state.bg.castle !== 'number') state.bg.castle = 0;
  if (typeof state.bg.nearHills !== 'number') state.bg.nearHills = 0;
}

export function updateBackground(state, dt) {
  ensureBg(state);
  const speed = state.speed;
  state.bg.clouds += speed * PARALLAX.clouds * dt;
  state.bg.farHills += speed * PARALLAX.farHills * dt;
  state.bg.castle += speed * PARALLAX.castle * dt;
  state.bg.nearHills += speed * PARALLAX.nearHills * dt;
}

function rgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function shiftFor(offset, pattern) {
  return ((offset % pattern) + pattern) % pattern;
}

function drawCloud(ctx, x, y, w) {
  const r = w / 5;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.arc(x + r, y - r * 0.6, r * 0.8, 0, Math.PI * 2);
  ctx.arc(x + r * 2, y - r * 0.25, r * 0.9, 0, Math.PI * 2);
  ctx.arc(x + r * 2.8, y + r * 0.05, r * 0.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawCloudLayer(ctx, offset) {
  const width = ctx.canvas.width;
  const shift = shiftFor(offset, CLOUD_PATTERN);
  const startX = -CLOUD_PATTERN - shift;
  ctx.fillStyle = rgba(COLORS.muted, 0.3);
  for (let x = startX; x < width + CLOUD_PATTERN; x += CLOUD_PATTERN) {
    for (const c of CLOUDS) {
      drawCloud(ctx, x + c.x, c.y, c.w);
    }
  }
}

function drawHillLayer(ctx, offset, color, baseY, radii, pattern) {
  const width = ctx.canvas.width;
  const shift = shiftFor(offset, pattern);
  const startX = -pattern - shift;

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(startX, baseY);

  let x = startX;
  let i = 0;
  while (x < width + pattern) {
    const w = pattern * radii[i % radii.length];
    ctx.arc(x + w / 2, baseY, w / 2, Math.PI, 0, false);
    x += w;
    i += 1;
  }

  ctx.closePath();
  ctx.fill();
}

function drawCrenellation(ctx, leftX, topY, width, merlonW, merlonGap, merlonH) {
  const step = merlonW + merlonGap;
  for (let cx = leftX; cx + merlonW <= leftX + width; cx += step) {
    ctx.fillRect(cx, topY - merlonH, merlonW, merlonH);
  }
}

function drawTower(ctx, leftX, topY, w, h, merlonW, merlonGap, merlonH) {
  ctx.fillRect(leftX, topY, w, h);
  drawCrenellation(ctx, leftX, topY, w, merlonW, merlonGap, merlonH);
}

function drawCastleTile(ctx, x, baseY, tileW) {
  const wallH = 64;
  const towerH = 118;
  const keepH = 168;
  const towerW = 54;
  const keepW = 74;
  const merlonW = 12;
  const merlonGap = 10;
  const merlonH = 16;

  ctx.fillStyle = COLORS.castle;

  ctx.fillRect(x, baseY - wallH, tileW, wallH);

  const wallSegment = tileW / 2 - keepW / 2 - towerW / 2;
  drawCrenellation(ctx, x + towerW / 2, baseY - wallH, wallSegment, merlonW, merlonGap, merlonH);
  drawCrenellation(
    ctx,
    x + tileW / 2 + keepW / 2,
    baseY - wallH,
    wallSegment,
    merlonW,
    merlonGap,
    merlonH,
  );

  drawTower(ctx, x - towerW / 2, baseY - towerH, towerW, towerH, merlonW, merlonGap, merlonH);
  drawTower(
    ctx,
    x + tileW - towerW / 2,
    baseY - towerH,
    towerW,
    towerH,
    merlonW,
    merlonGap,
    merlonH,
  );
  drawTower(
    ctx,
    x + tileW / 2 - keepW / 2,
    baseY - keepH,
    keepW,
    keepH,
    merlonW,
    merlonGap,
    merlonH,
  );

  ctx.fillStyle = COLORS.groundDark;
  const gateW = 26;
  const gateH = 44;
  const gateCx = x + tileW / 2;
  ctx.fillRect(gateCx - gateW / 2, baseY - gateH, gateW, gateH);
  ctx.beginPath();
  ctx.arc(gateCx, baseY - gateH, gateW / 2, Math.PI, 0, false);
  ctx.fill();
}

function drawCastleLayer(ctx, offset, baseY, tileW) {
  const width = ctx.canvas.width;
  const shift = shiftFor(offset, tileW);
  const startX = -tileW - shift;
  for (let x = startX; x < width + tileW; x += tileW) {
    drawCastleTile(ctx, x, baseY, tileW);
  }
}

export function drawBackground(ctx, state) {
  ensureBg(state);
  const horizon = GROUND_Y;

  drawCloudLayer(ctx, state.bg.clouds);
  drawHillLayer(ctx, state.bg.farHills, COLORS.hillFar, horizon, FAR_HILL_RADII, FAR_HILL_PATTERN);
  drawCastleLayer(ctx, state.bg.castle, horizon, CASTLE_PATTERN);
  drawHillLayer(ctx, state.bg.nearHills, COLORS.hillNear, horizon, NEAR_HILL_RADII, NEAR_HILL_PATTERN);
}
