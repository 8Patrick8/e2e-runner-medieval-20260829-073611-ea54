export function initInput(onAction) {
  function onKeydown(event) {
    if (event.code !== 'Space' && event.code !== 'ArrowUp') {
      return;
    }
    event.preventDefault();
    if (event.repeat) {
      return;
    }
    onAction();
  }

  function onPointerDown() {
    onAction();
  }

  window.addEventListener('keydown', onKeydown);
  window.addEventListener('pointerdown', onPointerDown);
}
