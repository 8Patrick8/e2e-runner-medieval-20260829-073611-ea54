import { MAX_SPEED, SPEED_ACCEL } from './constants.js';
import { saveHighscore } from './highscore.js';

export function updateGameplay(state, dt) {
  if (state.phase !== 'playing') {
    return;
  }

  state.distance += state.speed * dt;
  state.score = Math.floor(state.distance);

  state.speed = Math.min(state.speed + SPEED_ACCEL * dt, MAX_SPEED);

  if (state.score > state.highscore) {
    state.highscore = state.score;
    saveHighscore(state.highscore);
  }
}
