import { COLORS, GROUND_Y, GRAVITY, JUMP_VELOCITY } from './constants.js';

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
  const x = p.x;
  const y = p.y;
  const w = p.w;
  const h = p.h;

  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(x + 6, y + h - 14, 8, 14);
  ctx.fillRect(x + w - 14, y + h - 14, 8, 14);

  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(x + 4, y + 12, w - 8, h - 24);

  ctx.fillStyle = COLORS.steel;
  ctx.fillRect(x + 6, y, w - 12, 12);

  ctx.fillStyle = COLORS.accent;
  ctx.fillRect(x + w / 2 - 2, y - 4, 4, 6);

  ctx.strokeStyle = COLORS.border;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
}
