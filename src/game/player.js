import { COLORS, GROUND_Y, GRAVITY, JUMP_VELOCITY } from './constants.js';

const RUN_STRIDE = 60;

export function updatePlayer(state, dt) {
  const p = state.player;
  if (!p.onGround) {
    p.vy += GRAVITY * dt;
    p.y += p.vy * dt;
    const floorY = GROUND_Y - p.h;
    if (p.y >= floorY) {
      p.y = floorY;
      p.vy = 0;
      p.onGround = true;
    }
  } else {
    p.runFrame += dt * state.speed;
  }
}

export function jump(state) {
  const p = state.player;
  if (!p.onGround) {
    return;
  }
  p.vy = JUMP_VELOCITY;
  p.onGround = false;
}

export function drawPlayer(ctx, state) {
  const p = state.player;
  const px = p.x;
  const py = p.y;

  const frame = Math.floor(p.runFrame / RUN_STRIDE) % 2;
  const hop = frame === 1 ? -2 : 0;
  const leftLift = frame === 0 ? 0 : 4;
  const rightLift = frame === 0 ? 4 : 0;

  const parts = [
    { x: px + 14, y: py + hop, w: 4, h: 8, fill: COLORS.accent },
    { x: px + 10, y: py + 6 + hop, w: 12, h: 12, fill: COLORS.steel },
    { x: px + 10, y: py + 14 + hop, w: 12, h: 4, fill: COLORS.steelDark },
    { x: px + 8, y: py + 18 + hop, w: 16, h: 18, fill: COLORS.accent },
    { x: px + 8, y: py + 36 - leftLift, w: 6, h: 10, fill: COLORS.ground },
    { x: px + 18, y: py + 36 - rightLift, w: 6, h: 10, fill: COLORS.ground },
    { x: px + 8, y: py + 46 - leftLift, w: 6, h: 2, fill: COLORS.groundDark },
    { x: px + 18, y: py + 46 - rightLift, w: 6, h: 2, fill: COLORS.groundDark },
  ];

  for (const part of parts) {
    ctx.fillStyle = COLORS.border;
    ctx.fillRect(part.x - 2, part.y - 2, part.w + 4, part.h + 4);
  }
  for (const part of parts) {
    ctx.fillStyle = part.fill;
    ctx.fillRect(part.x, part.y, part.w, part.h);
  }

  ctx.fillStyle = COLORS.border;
  ctx.fillRect(px + 14, py + 20 + hop, 4, 12);
}
