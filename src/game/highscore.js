const HIGHSCORE_KEY = 'medieval-runner-highscore';

export function loadHighscore() {
  try {
    const raw = localStorage.getItem(HIGHSCORE_KEY);
    if (raw === null) {
      return 0;
    }
    const value = Number(raw);
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

export function saveHighscore(value) {
  if (!Number.isFinite(value)) {
    return;
  }
  try {
    localStorage.setItem(HIGHSCORE_KEY, String(value));
  } catch {
    // Storage may be unavailable (private mode, quota) — ignore.
  }
}
