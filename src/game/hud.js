import { COLORS } from './constants.js';

const HUD_PADDING = 16;

const FONT_STACK = "'Segoe UI', 'Trebuchet MS', system-ui, sans-serif";

function formatScore(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    return '0';
  }
  return String(Math.max(0, Math.floor(n)));
}

function drawText(ctx, text, x, y, size, align, fillStyle) {
  ctx.font = `700 ${size}px ${FONT_STACK}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';
  ctx.lineWidth = 2;
  ctx.strokeStyle = COLORS.border;
  ctx.fillStyle = fillStyle;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

export function drawHud(ctx, state) {
  const size = ctx.canvas.width < 640 ? 14 : 18;

  const score = formatScore(state.score);
  const highscore = formatScore(state.highscore);

  drawText(ctx, score, HUD_PADDING, HUD_PADDING, size, 'left', COLORS.fg);

  drawText(ctx, 'BEST', ctx.canvas.width - HUD_PADDING, HUD_PADDING, size, 'right', COLORS.muted);
  drawText(
    ctx,
    highscore,
    ctx.canvas.width - HUD_PADDING,
    HUD_PADDING + size + 4,
    size,
    'right',
    COLORS.fg
  );
}
