import { GROUND_Y, START_SPEED, PLAYER_W, PLAYER_H } from './constants.js';

export function createGameState() {
  return {
    phase: 'menu',
    speed: START_SPEED,
    distance: 0,
    score: 0,
    highscore: 0,
    player: {
      x: 200,
      y: GROUND_Y - PLAYER_H,
      w: PLAYER_W,
      h: PLAYER_H,
      vy: 0,
      onGround: true,
      runFrame: 0,
    },
    obstacles: [],
    bg: {},
  };
}

export function resetGame(state) {
  state.speed = START_SPEED;
  state.distance = 0;
  state.score = 0;
  state.player.x = 200;
  state.player.y = GROUND_Y - PLAYER_H;
  state.player.vy = 0;
  state.player.onGround = true;
  state.player.runFrame = 0;
  state.obstacles = [];
  state.bg = {};
}
