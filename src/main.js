import './style.css';
import { GROUND_Y, COLORS } from './game/constants.js';
import { createGameState, resetGame } from './game/state.js';
import { initInput } from './game/input.js';
import { updatePlayer, drawPlayer, jump } from './game/player.js';
import { updateObstacles, drawObstacles } from './game/obstacles.js';
import { updateBackground, drawBackground } from './game/background.js';
import { checkCollision } from './game/collision.js';
import { updateGameplay } from './game/gameplay.js';
import { loadHighscore, saveHighscore } from './game/highscore.js';
import { drawHud } from './game/hud.js';
import { drawStartScreen, drawGameOverScreen } from './game/screens.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resize);
resize();

const state = createGameState();
state.highscore = loadHighscore();

function onAction() {
  if (state.phase === 'menu') {
    state.phase = 'playing';
  } else if (state.phase === 'playing') {
    jump(state);
  } else if (state.phase === 'gameover') {
    resetGame(state);
    state.phase = 'playing';
  }
}

initInput(onAction);

function drawBaseScene() {
  const sky = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  sky.addColorStop(0, COLORS.skyTop);
  sky.addColorStop(1, COLORS.skyHorizon);
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, GROUND_Y);

  ctx.fillStyle = COLORS.ground;
  ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

  ctx.fillStyle = COLORS.groundDark;
  ctx.fillRect(0, GROUND_Y, canvas.width, 2);
}

let last = performance.now();

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;

  updateGameplay(state, dt);
  updatePlayer(state, dt);
  updateObstacles(state, dt);
  if (checkCollision(state)) {
    state.phase = 'gameover';
    if (state.score > state.highscore) {
      state.highscore = state.score;
    }
    saveHighscore(state.highscore);
  }
  updateBackground(state, dt);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBaseScene();
  drawBackground(ctx, state);
  drawObstacles(ctx, state);
  drawPlayer(ctx, state);
  drawHud(ctx, state);

  if (state.phase === 'menu') {
    drawStartScreen(ctx, state);
  } else if (state.phase === 'gameover') {
    drawGameOverScreen(ctx, state);
  }

  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);

Object.defineProperty(window, '__TEST_API__', {
  enumerable: true,
  get() {
    return {
      get scene() {
        return state.phase;
      },
      get player() {
        return { x: state.player.x, y: state.player.y };
      },
      get score() {
        return state.score;
      },
    };
  },
});
