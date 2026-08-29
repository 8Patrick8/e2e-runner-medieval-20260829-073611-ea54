export function checkCollision(state) {
  const player = state.player;

  for (const obstacle of state.obstacles) {
    const overlapsX = player.x < obstacle.x + obstacle.w && player.x + player.w > obstacle.x;
    const overlapsY = player.y < obstacle.y + obstacle.h && player.y + player.h > obstacle.y;

    if (overlapsX && overlapsY) {
      return true;
    }
  }

  return false;
}
