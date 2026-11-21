/* Mouse and keyboard input for Twice-Told Harbor.
   A click on either canvas is a guess at that point of the scene; the arrow
   keys walk the brass focus ring (Shift walks faster) and Enter or Space
   guesses where it rests. H, M and R are the hint, mute and restart keys. */
import { PANEL_HEIGHT, PANEL_WIDTH } from './draw-helpers.js';

const FOCUS_STEP = 9;
const FOCUS_STEP_FAST = 27;

/** Convert a mouse event on a canvas into panel coordinates. */
export function eventToPanel(event, canvas) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * PANEL_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * PANEL_HEIGHT,
  };
}

function clampFocus(game) {
  game.focus.x = Math.min(PANEL_WIDTH - 8, Math.max(8, game.focus.x));
  game.focus.y = Math.min(PANEL_HEIGHT - 8, Math.max(8, game.focus.y));
}

/**
 * Wire up both canvases and the keyboard.
 * handlers: { onGuess(x, y), onHint(), onRestart(), onToggleSound() }
 */
export function attachInput(canvases, game, handlers) {
  for (const canvas of canvases) {
    canvas.addEventListener('click', (event) => {
      const point = eventToPanel(event, canvas);
      game.focus = { x: point.x, y: point.y };
      handlers.onGuess(point.x, point.y);
    });
  }
  window.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? FOCUS_STEP_FAST : FOCUS_STEP;
    switch (event.key) {
      case 'ArrowLeft':
        game.focus.x -= step;
        break;
      case 'ArrowRight':
        game.focus.x += step;
        break;
      case 'ArrowUp':
        game.focus.y -= step;
        break;
      case 'ArrowDown':
        game.focus.y += step;
        break;
      case 'Enter':
      case ' ':
        handlers.onGuess(game.focus.x, game.focus.y);
        break;
      case 'h':
      case 'H':
        handlers.onHint();
        break;
      case 'm':
      case 'M':
        handlers.onToggleSound();
        break;
      case 'r':
      case 'R':
        handlers.onRestart();
        break;
      default:
        return;
    }
    clampFocus(game);
    event.preventDefault();
  });
}
