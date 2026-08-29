(function (global) {
  'use strict';

  var W = 960;
  var H = 540;
  var GROUND_Y = 421;

  var COLORS = {
    bg: '#232b3b',
    fg: '#f4e9d6',
    accent: '#e05d3a',
    border: '#2f2a26',
    muted: '#8b99a6',
    skyTop: '#2a3350',
    skyHorizon: '#c98a5b',
    hillFar: '#5b6472',
    hillNear: '#3f4a3a',
    castle: '#2e3440',
    wood: '#8a5a3b',
    woodDark: '#5e3b28',
    woodLight: '#a9744f',
    steel: '#b8c0c8',
    steelDark: '#7d8a96',
    ground: '#4a3b30',
    groundDark: '#332821',
  };

  function initCanvas(canvas) {
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = false;
    }
    return ctx;
  }

  function shift(offset, factor, period) {
    return ((offset * factor) % period + period) % period;
  }

  function forEachTile(offset, factor, period, fn) {
    var s = shift(offset, factor, period);
    for (var x = -s - period; x < W + period; x += period) {
      fn(x);
    }
  }

  function drawSky(ctx) {
    var sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    sky.addColorStop(0, COLORS.skyTop);
    sky.addColorStop(1, COLORS.skyHorizon);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, GROUND_Y);
  }

  function drawCloud(ctx, x, y) {
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = COLORS.muted;
    ctx.beginPath();
    ctx.ellipse(x, y, 34, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(x + 26, y + 4, 26, 12, 0, 0, Math.PI * 2);
    ctx.ellipse(x - 26, y + 5, 22, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  function drawClouds(ctx, offset) {
    forEachTile(offset, 0.08, 480, function (x) {
      drawCloud(ctx, x + 120, 90);
      drawCloud(ctx, x + 340, 160);
    });
  }

  function drawHill(ctx, x, w, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, GROUND_Y);
    ctx.quadraticCurveTo(x + w / 2, GROUND_Y - h, x + w, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  }

  function drawHillsFar(ctx, offset) {
    forEachTile(offset, 0.15, 480, function (x) {
      drawHill(ctx, x, 260, 90, COLORS.hillFar);
      drawHill(ctx, x + 200, 300, 60, COLORS.hillFar);
    });
  }

  function drawCastleTile(ctx, x) {
    var wallTop = GROUND_Y - 70;
    ctx.fillStyle = COLORS.castle;
    ctx.fillRect(x, wallTop, 200, 70);
    var i;
    for (i = 0; i < 5; i++) {
      ctx.fillRect(x + 10 + i * 40, wallTop - 12, 22, 12);
    }
    ctx.fillRect(x + 8, wallTop - 34, 40, 104);
    for (i = 0; i < 2; i++) {
      ctx.fillRect(x + 8 + i * 22, wallTop - 44, 16, 10);
    }
    ctx.fillRect(x + 152, wallTop - 34, 40, 104);
    for (i = 0; i < 2; i++) {
      ctx.fillRect(x + 152 + i * 22, wallTop - 44, 16, 10);
    }
    ctx.fillStyle = COLORS.bg;
    ctx.fillRect(x + 82, GROUND_Y - 44, 36, 44);
  }

  function drawCastle(ctx, offset) {
    forEachTile(offset, 0.25, 640, function (x) {
      drawCastleTile(ctx, x + 60);
    });
  }

  function drawHillsNear(ctx, offset) {
    forEachTile(offset, 0.35, 640, function (x) {
      drawHill(ctx, x, 320, 70, COLORS.hillNear);
      drawHill(ctx, x + 320, 300, 50, COLORS.hillNear);
    });
  }

  function drawGround(ctx, offset) {
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.fillStyle = COLORS.groundDark;
    ctx.fillRect(0, GROUND_Y, W, 2);

    ctx.save();
    ctx.fillStyle = COLORS.groundDark;
    forEachTile(offset, 1.0, 160, function (x) {
      ctx.fillRect(x + 30, GROUND_Y + 18, 18, 6);
      ctx.fillRect(x + 90, GROUND_Y + 40, 26, 8);
      ctx.fillRect(x + 140, GROUND_Y + 22, 14, 5);
    });
    ctx.restore();
  }

  function drawScene(ctx, offset) {
    drawSky(ctx);
    drawClouds(ctx, offset);
    drawHillsFar(ctx, offset);
    drawCastle(ctx, offset);
    drawHillsNear(ctx, offset);
    drawGround(ctx, offset);
  }

  function drawShadow(ctx, x, y, halfWidth) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = COLORS.groundDark;
    ctx.beginPath();
    ctx.ellipse(x, y + 3, halfWidth, halfWidth * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawKnight(ctx, cx, bottomY, frame, scale) {
    var s = scale || 1;
    var w = 32 * s;
    var h = 48 * s;
    var x = cx - w / 2;
    var y = bottomY - h;
    var bob = frame === 1 ? -2 * s : 0;

    ctx.save();
    ctx.lineWidth = 2 * s;

    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(x + 14 * s, y - 6 * s, 4 * s, 8 * s);

    ctx.fillStyle = COLORS.steel;
    ctx.fillRect(x + 10 * s, y, 12 * s, 14 * s);
    ctx.fillStyle = COLORS.steelDark;
    ctx.fillRect(x + 16 * s, y, 6 * s, 14 * s);

    ctx.fillStyle = COLORS.accent;
    ctx.fillRect(x + 8 * s, y + 14 * s + bob, 16 * s, 18 * s - bob);
    ctx.fillStyle = COLORS.woodDark;
    ctx.fillRect(x + 14 * s, y + 16 * s + bob, 4 * s, 14 * s - bob);

    ctx.fillStyle = COLORS.ground;
    if (frame === 1) {
      ctx.fillRect(x + 8 * s, y + 28 * s, 6 * s, 16 * s);
      ctx.fillRect(x + 18 * s, y + 32 * s, 6 * s, 12 * s);
    } else {
      ctx.fillRect(x + 8 * s, y + 32 * s, 6 * s, 12 * s);
      ctx.fillRect(x + 18 * s, y + 28 * s, 6 * s, 16 * s);
    }
    ctx.fillStyle = COLORS.groundDark;
    ctx.fillRect(x + 8 * s, y + 42 * s, 6 * s, 6 * s);
    ctx.fillRect(x + 18 * s, y + 42 * s, 6 * s, 6 * s);

    ctx.strokeStyle = COLORS.border;
    ctx.strokeRect(x, y, w, h);

    ctx.restore();
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawBarrel(ctx, cx, bottomY, scale) {
    var s = scale || 1;
    var w = 28 * s;
    var h = 32 * s;
    var x = cx - w / 2;
    var y = bottomY - h;
    var r = 4 * s;

    ctx.save();
    ctx.fillStyle = COLORS.wood;
    roundedRectPath(ctx, x, y, w, h, r);
    ctx.fill();

    ctx.fillStyle = COLORS.woodDark;
    roundedRectPath(ctx, x + w * 0.66, y + 2 * s, w * 0.34, h - 4 * s, r);
    ctx.fill();

    ctx.fillStyle = COLORS.woodLight;
    ctx.fillRect(x + 3 * s, y + 6 * s, 3 * s, h - 12 * s);

    ctx.fillStyle = COLORS.steel;
    ctx.fillRect(x + 1 * s, y + 4 * s, w - 2 * s, 3 * s);
    ctx.fillRect(x + 1 * s, y + h - 7 * s, w - 2 * s, 3 * s);

    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 2 * s;
    roundedRectPath(ctx, x, y, w, h, r);
    ctx.stroke();

    ctx.restore();
  }

  function drawFence(ctx, cx, bottomY, scale) {
    var s = scale || 1;
    var w = 36 * s;
    var h = 28 * s;
    var x = cx - w / 2;
    var y = bottomY - h;
    var postW = 8 * s;
    var rightX = x + w - postW;

    function post(px) {
      ctx.fillRect(px, y + 6 * s, postW, h - 6 * s);
      ctx.beginPath();
      ctx.moveTo(px, y + 6 * s);
      ctx.lineTo(px + postW / 2, y);
      ctx.lineTo(px + postW, y + 6 * s);
      ctx.closePath();
      ctx.fill();
    }

    ctx.save();
    ctx.fillStyle = COLORS.wood;
    post(x);
    post(rightX);
    ctx.fillRect(x, y + 8 * s, w, 6 * s);
    ctx.fillRect(x, y + 16 * s, w, 6 * s);

    ctx.fillStyle = COLORS.woodDark;
    ctx.fillRect(rightX, y + 6 * s, 2 * s, h - 6 * s);
    ctx.fillRect(x, y + 8 * s, w, 2 * s);

    ctx.fillStyle = COLORS.woodLight;
    ctx.fillRect(x + 1 * s, y + 6 * s, 2 * s, h - 6 * s);

    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 2 * s;
    ctx.strokeRect(x, y, w, h);

    ctx.restore();
  }

  global.RunnerScene = {
    initCanvas: initCanvas,
    drawScene: drawScene,
    drawShadow: drawShadow,
    drawKnight: drawKnight,
    drawBarrel: drawBarrel,
    drawFence: drawFence,
    W: W,
    H: H,
    GROUND_Y: GROUND_Y,
  };
})(typeof window !== 'undefined' ? window : this);
