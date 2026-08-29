import { COLORS } from './constants.js';

const FONT_FAMILY = "'Georgia', 'Times New Roman', serif";
const FONT_UI = "'Segoe UI', 'Trebuchet MS', system-ui, sans-serif";

function hexToRgba(hex, alpha) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawOverlay(ctx, alpha) {
  const { width, height } = ctx.canvas;
  ctx.fillStyle = hexToRgba(COLORS.bg, alpha);
  ctx.fillRect(0, 0, width, height);
}

function drawText(ctx, text, x, y, font, fillStyle, options = {}) {
  const { stroke = null, lineWidth = 2, shadow = null, align = 'center' } = options;
  ctx.save();
  ctx.font = font;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  if (shadow) {
    ctx.shadowColor = shadow.color;
    ctx.shadowBlur = shadow.blur;
    ctx.shadowOffsetX = shadow.offsetX || 0;
    ctx.shadowOffsetY = shadow.offsetY || 0;
  }
  if (stroke) {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = stroke;
    ctx.strokeText(text, x, y);
  }
  ctx.fillStyle = fillStyle;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawRoundedButton(ctx, x, y, width, height, radius, fill, border) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.strokeStyle = border;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawStartScreen(ctx, state) {
  const { width, height } = ctx.canvas;
  const cx = width / 2;
  const cy = height / 2;

  drawOverlay(ctx, 0.55);

  drawText(ctx, 'Mittelalter-Endless-Runner', cx, cy - 64, `700 40px ${FONT_FAMILY}`, COLORS.fg, {
    shadow: { color: COLORS.border, blur: 6, offsetY: 3 },
  });

  drawText(ctx, 'Leertaste oder Klick/Tap', cx, cy - 12, `400 18px ${FONT_UI}`, COLORS.muted);

  if (state.highscore > 0) {
    drawText(ctx, `Highscore: ${state.highscore}`, cx, cy + 24, `400 18px ${FONT_UI}`, COLORS.muted);
  }

  const pulse = 1 + 0.05 * Math.sin(performance.now() / 300);
  const buttonWidth = 176 * pulse;
  const buttonHeight = 48 * pulse;
  const buttonY = cy + 76;
  drawRoundedButton(
    ctx,
    cx - buttonWidth / 2,
    buttonY - buttonHeight / 2,
    buttonWidth,
    buttonHeight,
    8,
    COLORS.accent,
    COLORS.border
  );
  drawText(ctx, 'STARTEN', cx, buttonY, `700 20px ${FONT_UI}`, COLORS.fg);
}

export function drawGameOverScreen(ctx, state) {
  const { width, height } = ctx.canvas;
  const cx = width / 2;
  const cy = height / 2;

  drawOverlay(ctx, 0.65);

  drawText(ctx, 'Game Over', cx, cy - 72, `700 44px ${FONT_FAMILY}`, COLORS.accent, {
    stroke: COLORS.border,
    lineWidth: 2,
  });

  drawText(ctx, `Punktestand: ${state.score}`, cx, cy - 12, `400 24px ${FONT_UI}`, COLORS.fg);

  drawText(ctx, `Highscore: ${state.highscore}`, cx, cy + 22, `400 18px ${FONT_UI}`, COLORS.fg);

  if (state.score > 0 && state.score > state.highscore) {
    drawText(ctx, 'NEUER REKORD', cx, cy + 50, `700 18px ${FONT_UI}`, COLORS.accent);
  }

  drawText(ctx, 'Neustart: Leertaste oder Klick', cx, cy + 88, `400 18px ${FONT_UI}`, COLORS.muted);
}
