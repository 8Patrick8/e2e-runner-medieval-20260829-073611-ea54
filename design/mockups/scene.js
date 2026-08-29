(function () {
  'use strict';

  var W = 960;
  var H = 540;
  var GROUND_RATIO = 0.78;
  var GROUND_Y = Math.round(H * GROUND_RATIO);

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
    accentDark: '#b34a2a'
  };

  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgba(hex, a) {
    var c = hexToRgb(hex);
    return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')';
  }

  function seeded(seed) {
    var s = seed;
    return function () {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
  }

  function tri(ctx, x1, y1, x2, y2, x3, y3) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fill();
  }

  function outlined(ctx, x, y, w, h, fill) {
    ctx.fillStyle = COLORS.border;
    ctx.fillRect(x - 2, y - 2, w + 4, h + 4);
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, w, h);
  }

  function initCanvas(canvas) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function drawSky(ctx) {
    var horizonY = H * 0.7;
    var g = ctx.createLinearGradient(0, 0, 0, horizonY);
    g.addColorStop(0, COLORS.skyTop);
    g.addColorStop(1, COLORS.skyHorizon);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, horizonY);
    ctx.fillStyle = COLORS.skyHorizon;
    ctx.fillRect(0, horizonY, W, GROUND_Y - horizonY);
  }

  function drawCloud(ctx, x, y, s) {
    ctx.beginPath();
    ctx.arc(x, y, 26 * s, 0, Math.PI * 2);
    ctx.arc(x + 28 * s, y - 10 * s, 20 * s, 0, Math.PI * 2);
    ctx.arc(x + 56 * s, y, 24 * s, 0, Math.PI * 2);
    ctx.arc(x + 28 * s, y + 8 * s, 24 * s, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawClouds(ctx, offset) {
    ctx.fillStyle = rgba(COLORS.muted, 0.30);
    var span = W + 400;
    var clouds = [
      { x: 180, y: 90, s: 1.0 },
      { x: 580, y: 56, s: 0.7 },
      { x: 940, y: 138, s: 1.25 },
      { x: 1200, y: 82, s: 0.85 }
    ];
    for (var i = 0; i < clouds.length; i++) {
      var c = clouds[i];
      var x = c.x - offset * 0.08;
      x = ((x % span) + span) % span - 200;
      drawCloud(ctx, x, c.y, c.s);
    }
  }

  function drawHillsTile(ctx, x, w, baseY, color, seed, ampMin, ampMax, peakW) {
    var rand = seeded(seed);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    var px = x;
    while (px < x + w + 1) {
      var wseg = peakW * (0.7 + rand() * 0.6);
      var amp = ampMin + rand() * (ampMax - ampMin);
      ctx.lineTo(px + wseg * 0.5, baseY - amp);
      ctx.lineTo(px + wseg, baseY);
      px += wseg;
    }
    ctx.lineTo(x + w, baseY);
    ctx.closePath();
    ctx.fill();
  }

  function drawFarHills(ctx, offset) {
    var tw = 480;
    var scroll = (offset * 0.15) % tw;
    for (var i = -1; i <= 2; i++) {
      drawHillsTile(ctx, i * tw - scroll, tw, GROUND_Y, COLORS.hillFar, 11, 55, 140, 92);
    }
  }

  function drawTower(ctx, tx, baseY, th, tw) {
    ctx.fillStyle = COLORS.castle;
    ctx.fillRect(tx, baseY - th, tw, th);
    var merlonW = Math.max(9, tw / 5);
    var merlonH = 12;
    for (var mx = tx; mx + merlonW <= tx + tw + 0.5; mx += merlonW + 6) {
      ctx.fillRect(mx, baseY - th - merlonH, merlonW, merlonH);
    }
    tri(ctx, tx - 4, baseY - th, tx + tw / 2, baseY - th - 24, tx + tw + 4, baseY - th);
  }

  function drawCastleTile(ctx, x, baseY) {
    var w = 600;
    var wallH = 62;
    ctx.fillStyle = COLORS.castle;
    ctx.fillRect(x, baseY - wallH, w, wallH);
    var merlonW = 18;
    var merlonH = 13;
    for (var mx = x; mx + merlonW <= x + w + 0.5; mx += merlonW + 15) {
      ctx.fillRect(mx, baseY - wallH - merlonH, merlonW, merlonH);
    }
    ctx.fillStyle = COLORS.border;
    ctx.fillRect(x + w / 2 - 16, baseY - 40, 32, 40);
    tri(ctx, x + w / 2 - 16, baseY - 40, x + w / 2, baseY - 52, x + w / 2 + 16, baseY - 40);
    drawTower(ctx, x + 40, baseY, 96, 44);
    drawTower(ctx, x + 278, baseY, 128, 50);
    drawTower(ctx, x + 516, baseY, 82, 40);
  }

  function drawCastle(ctx, offset) {
    var tw = 600;
    var scroll = (offset * 0.25) % tw;
    for (var i = -1; i <= 2; i++) {
      drawCastleTile(ctx, i * tw - scroll, GROUND_Y);
    }
  }

  function drawNearHills(ctx, offset) {
    var tw = 360;
    var scroll = (offset * 0.35) % tw;
    for (var i = -1; i <= 3; i++) {
      drawHillsTile(ctx, i * tw - scroll, tw, GROUND_Y, COLORS.hillNear, 7, 40, 90, 76);
    }
  }

  function drawStones(ctx, tileX) {
    var stones = [
      [40, 30, 6, 4, COLORS.groundDark],
      [150, 52, 5, 5, COLORS.woodDark],
      [240, 22, 4, 4, COLORS.groundDark],
      [330, 46, 6, 4, COLORS.woodDark],
      [410, 34, 5, 4, COLORS.groundDark]
    ];
    for (var i = 0; i < stones.length; i++) {
      var s = stones[i];
      ctx.fillStyle = s[4];
      ctx.fillRect(tileX + s[0], GROUND_Y + 14 + s[1], s[2], s[3]);
    }
  }

  function drawGround(ctx, offset) {
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);
    ctx.fillStyle = COLORS.groundDark;
    ctx.fillRect(0, GROUND_Y, W, 2);
    var tw = 480;
    var scroll = offset % tw;
    for (var i = -1; i <= 2; i++) {
      drawStones(ctx, i * tw - scroll);
    }
  }

  function drawScene(ctx, offset) {
    drawSky(ctx);
    drawClouds(ctx, offset);
    drawFarHills(ctx, offset);
    drawCastle(ctx, offset);
    drawNearHills(ctx, offset);
    drawGround(ctx, offset);
  }

  function drawShadow(ctx, cx, groundY, w) {
    ctx.fillStyle = rgba(COLORS.groundDark, 0.45);
    ctx.beginPath();
    ctx.ellipse(cx, groundY + 2, w, w * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawKnight(ctx, cx, groundY, frame, scale) {
    ctx.save();
    ctx.translate(cx, groundY);
    if (scale) ctx.scale(scale, scale);
    var top = -48;
    var bob = frame === 1 ? 2 : 0;

    // Federbusch (Plume)
    outlined(ctx, -2, top + bob - 6, 4, 8, COLORS.accent);
    // Helm 12x12
    outlined(ctx, -6, top + bob, 12, 12, COLORS.steel);
    ctx.fillStyle = COLORS.steelDark;
    ctx.fillRect(1, top + bob + 2, 5, 10);
    ctx.fillStyle = COLORS.border;
    ctx.fillRect(-4, top + bob + 6, 8, 2);
    // Körper/Wams 16x18
    outlined(ctx, -8, top + 12 + bob, 16, 18, COLORS.accent);
    ctx.fillStyle = COLORS.accentDark;
    ctx.fillRect(1, top + 14 + bob, 2, 14);
    ctx.fillStyle = COLORS.woodDark;
    ctx.fillRect(-8, top + 26 + bob, 16, 2);

    var legTop = top + 30 + bob;
    var bootY = legTop + 16;
    if (frame === 0) {
      outlined(ctx, -7, legTop, 6, 16, COLORS.ground);
      outlined(ctx, 1, legTop, 6, 16, COLORS.ground);
      ctx.fillStyle = COLORS.groundDark;
      ctx.fillRect(-8, bootY, 8, 2);
      ctx.fillRect(0, bootY, 8, 2);
    } else {
      outlined(ctx, -9, legTop, 6, 16, COLORS.ground);
      outlined(ctx, 3, legTop, 6, 16, COLORS.ground);
      ctx.fillStyle = COLORS.groundDark;
      ctx.fillRect(-10, bootY, 8, 2);
      ctx.fillRect(2, bootY, 8, 2);
    }
    ctx.restore();
  }

  function drawBarrel(ctx, cx, groundY, scale) {
    ctx.save();
    ctx.translate(cx, groundY);
    if (scale) ctx.scale(scale, scale);
    var w = 28;
    var h = 32;
    var left = -w / 2;
    var top = -h;
    outlined(ctx, left, top, w, h, COLORS.wood);
    ctx.fillStyle = COLORS.woodLight;
    ctx.fillRect(left + 3, top + 4, 3, h - 8);
    ctx.fillStyle = COLORS.woodDark;
    ctx.fillRect(left + w - 6, top + 4, 3, h - 8);
    ctx.fillStyle = COLORS.steel;
    ctx.fillRect(left + 3, top + 6, w - 6, 3);
    ctx.fillRect(left + 3, top + h - 9, w - 6, 3);
    ctx.fillStyle = COLORS.woodDark;
    ctx.fillRect(left + 9, top + 11, 2, h - 22);
    ctx.fillRect(left + 15, top + 11, 2, h - 22);
    ctx.restore();
  }

  function drawFence(ctx, cx, groundY, scale) {
    ctx.save();
    ctx.translate(cx, groundY);
    if (scale) ctx.scale(scale, scale);
    var w = 36;
    var h = 28;
    var left = -w / 2;
    var top = -h;
    outlined(ctx, left, top + 2, w, 6, COLORS.wood);
    outlined(ctx, left, top + 14, w, 6, COLORS.wood);
    outlined(ctx, left + 2, top, 8, h, COLORS.wood);
    outlined(ctx, left + w - 10, top, 8, h, COLORS.wood);
    ctx.fillStyle = COLORS.wood;
    tri(ctx, left + 2, top, left + 6, top - 8, left + 10, top);
    tri(ctx, left + w - 10, top, left + w - 6, top - 8, left + w - 2, top);
    ctx.fillStyle = COLORS.woodLight;
    ctx.fillRect(left + 4, top + 3, 2, h - 6);
    ctx.fillStyle = COLORS.woodDark;
    ctx.fillRect(left + w - 8, top + 3, 2, h - 6);
    ctx.restore();
  }

  window.RunnerScene = {
    W: W,
    H: H,
    GROUND_Y: GROUND_Y,
    COLORS: COLORS,
    initCanvas: initCanvas,
    drawScene: drawScene,
    drawKnight: drawKnight,
    drawBarrel: drawBarrel,
    drawFence: drawFence,
    drawShadow: drawShadow,
    rgba: rgba
  };
})();
