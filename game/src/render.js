/* Draws one panel of the current scene, plus everything the game state lays
   over the picture: rings on found differences, the hint shimmer, the fading
   cross of a miss, and the keyboard's brass focus ring. */
import { PAINTERS } from './painters.js';
import { differenceIds } from './scenes.js';
import { currentScene } from './game.js';
import { disc } from './draw-helpers.js';

const NO_CHANGES = new Set();

/** A satisfying ring around a found difference, with a little check mark. */
function drawFoundMarker(ctx, difference, now, foundAt) {
  const age = (now - foundAt) / 1000;
  const pulse = age < 0.6 ? Math.sin(age / 0.6 * Math.PI) * 6 : 0;
  const radius = difference.r + 7 + pulse;
  ctx.strokeStyle = '#ffb703';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(difference.x, difference.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#fff3d6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(difference.x, difference.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  // Check mark badge at the ring's top right.
  const bx = difference.x + radius * 0.72;
  const by = difference.y - radius * 0.72;
  disc(ctx, bx, by, 9, '#2f7d4f');
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(bx - 4.4, by);
  ctx.lineTo(bx - 1.2, by + 3.4);
  ctx.lineTo(bx + 4.8, by - 3.8);
  ctx.stroke();
}

/** The dashed, shimmering circle a hint leaves on one difference. */
function drawHintRing(ctx, difference, now) {
  ctx.save();
  ctx.strokeStyle = '#00b4d8';
  ctx.lineWidth = 3.4;
  ctx.setLineDash([8, 6]);
  ctx.lineDashOffset = -now / 28;
  ctx.beginPath();
  ctx.arc(difference.x, difference.y, difference.r + 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** A red cross where a guess just missed, fading over half a second. */
function drawMiss(ctx, miss, now) {
  const age = (now - miss.at) / 1000;
  if (age > 0.55) return;
  ctx.save();
  ctx.globalAlpha = 1 - age / 0.55;
  ctx.strokeStyle = '#d90429';
  ctx.lineWidth = 4.4;
  ctx.lineCap = 'round';
  const s = 11;
  ctx.beginPath();
  ctx.moveTo(miss.x - s, miss.y - s);
  ctx.lineTo(miss.x + s, miss.y + s);
  ctx.moveTo(miss.x + s, miss.y - s);
  ctx.lineTo(miss.x - s, miss.y + s);
  ctx.stroke();
  ctx.restore();
}

/** The brass ring the keyboard moves; Enter checks whatever it encircles. */
function drawFocusRing(ctx, focus) {
  ctx.strokeStyle = '#b3812e';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(focus.x, focus.y, 17, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(179, 129, 46, 0.75)';
  ctx.lineWidth = 1.6;
  for (const [dx, dy] of [[0, -24], [0, 24], [-24, 0], [24, 0]]) {
    ctx.beginPath();
    ctx.moveTo(focus.x + dx * 0.72, focus.y + dy * 0.72);
    ctx.lineTo(focus.x + dx, focus.y + dy);
    ctx.stroke();
  }
  disc(ctx, focus.x, focus.y, 2, '#b3812e');
}

/**
 * Render one panel. `side` is 'left' for the original picture (no changes)
 * or 'right' for the retelling (every difference applied).
 */
export function renderPanel(ctx, game, side, now) {
  const scene = currentScene(game);
  const painter = PAINTERS[scene.id];
  painter(ctx, side === 'right' ? differenceIds(scene) : NO_CHANGES);
  for (const difference of scene.differences) {
    if (game.found.has(difference.id)) {
      drawFoundMarker(ctx, difference, now, game.foundAt.get(difference.id) ?? now);
    }
  }
  if (game.hintId && now < game.hintUntil && !game.found.has(game.hintId)) {
    const difference = scene.differences.find((d) => d.id === game.hintId);
    if (difference) drawHintRing(ctx, difference, now);
  }
  if (game.miss) drawMiss(ctx, game.miss, now);
  if (game.status === 'playing') drawFocusRing(ctx, game.focus);
}
