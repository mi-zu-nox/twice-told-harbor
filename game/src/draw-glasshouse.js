/* Scene 3 painter: the Glasshouse Garden at noon.
   The brightest scene of the three, and the differences hide in its details:
   a face, a wing colour, one band of a rainbow. */
import { cloud, disc, glow, label, oval, polygon, skyGradient } from './draw-helpers.js';

function drawSkyAndSun(ctx, changed) {
  skyGradient(ctx, [[0, '#7ec3ee'], [0.45, '#bfe6f7'], [0.7, '#eaf7e0'], [1, '#eaf7e0']]);
  cloud(ctx, 210, 40, 0.75, 'rgba(255,255,255,0.95)');
  cloud(ctx, 392, 66, 0.55, 'rgba(255,255,255,0.9)');
  // Sun with rays; it smiles in the original only.
  glow(ctx, 68, 56, 52, 'rgba(255, 215, 106, 0.5)');
  ctx.strokeStyle = '#e8a91c';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2 + 0.4;
    ctx.beginPath();
    ctx.moveTo(68 + Math.cos(angle) * 32, 56 + Math.sin(angle) * 32);
    ctx.lineTo(68 + Math.cos(angle) * 42, 56 + Math.sin(angle) * 42);
    ctx.stroke();
  }
  disc(ctx, 68, 56, 27, '#ffd94e');
  if (!changed.has('sunface')) {
    disc(ctx, 59, 51, 3, '#8a5f1c');
    disc(ctx, 77, 51, 3, '#8a5f1c');
    ctx.strokeStyle = '#8a5f1c';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.arc(68, 58, 11, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
    disc(ctx, 52, 60, 4, 'rgba(232, 139, 176, 0.7)');
    disc(ctx, 84, 60, 4, 'rgba(232, 139, 176, 0.7)');
  }
}

function drawRainbow(ctx, changed) {
  const bands = [
    [96, '#e05a4e'], [85, '#f09543'], [74, '#f7d154'], [63, '#69b96a'], [52, '#5b8fd6'],
  ];
  ctx.lineWidth = 10;
  ctx.lineCap = 'butt';
  for (const [radius, colour] of bands) {
    if (colour === '#69b96a' && changed.has('rainbow')) continue;
    ctx.strokeStyle = colour;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.arc(430, 216, radius, Math.PI * 1.02, Math.PI * 1.98);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  cloud(ctx, 338, 210, 0.6, 'rgba(255,255,255,0.95)');
  cloud(ctx, 522, 210, 0.6, 'rgba(255,255,255,0.95)');
}

function drawGround(ctx) {
  ctx.fillStyle = '#8fce6e';
  ctx.fillRect(0, 300, 540, 100);
  ctx.fillStyle = '#7cc25e';
  ctx.fillRect(0, 300, 540, 10);
  // The garden path to the glasshouse door.
  polygon(ctx, [[262, 400], [308, 400], [296, 330], [274, 330]], '#e3d0a4');
  // Flower beds along the bottom.
  for (let x = 16; x < 540; x += 26) {
    if (x > 250 && x < 330) continue;
    disc(ctx, x, 384, 5, ['#e88bb0', '#e05a4e', '#f7d154', '#b07cd8'][x % 4]);
    disc(ctx, x, 384, 2, '#fff6da');
    ctx.strokeStyle = '#4e8c3f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, 388);
    ctx.lineTo(x, 398);
    ctx.stroke();
  }
}

function drawSunflower(ctx, changed) {
  ctx.strokeStyle = '#4e8c3f';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(94, 332);
  ctx.quadraticCurveTo(88, 280, 94, 236);
  ctx.stroke();
  // Leaves.
  oval(ctx, 76, 292, 14, 6, '#69b96a');
  oval(ctx, 112, 268, 14, 6, '#69b96a');
  // Petals.
  ctx.fillStyle = '#f7b731';
  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    ctx.save();
    ctx.translate(94 + Math.cos(angle) * 24, 208 + Math.sin(angle) * 24);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(8, 0, 10, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // The face of the flower: seeded in the original, plain gold in the retelling.
  disc(ctx, 94, 208, 19, changed.has('sunflower') ? '#f7b731' : '#7a4a21');
  if (!changed.has('sunflower')) {
    for (const [dx, dy] of [[-8, -6], [0, -9], [8, -6], [-10, 3], [0, 0], [10, 3], [-6, 9], [6, 9]]) {
      disc(ctx, 94 + dx, 208 + dy, 2.2, '#4c2c10');
    }
  }
}

function drawGlasshouse(ctx) {
  // Glass body with a peaked roof.
  ctx.fillStyle = 'rgba(198, 232, 240, 0.85)';
  ctx.fillRect(176, 196, 208, 134);
  polygon(ctx, [[168, 196], [392, 196], [280, 138]], 'rgba(198, 232, 240, 0.9)');
  ctx.strokeStyle = '#3f6b4f';
  ctx.lineWidth = 4;
  ctx.strokeRect(176, 196, 208, 134);
  ctx.beginPath();
  ctx.moveTo(168, 196);
  ctx.lineTo(280, 138);
  ctx.lineTo(392, 196);
  ctx.stroke();
  // Panes.
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = 'rgba(63, 107, 79, 0.55)';
  for (let x = 228; x < 384; x += 52) {
    ctx.beginPath();
    ctx.moveTo(x, 196);
    ctx.lineTo(x, 330);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(176, 262);
  ctx.lineTo(384, 262);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(226, 167);
  ctx.lineTo(334, 167);
  ctx.stroke();
  // Plants inside: pots and leafy shapes.
  for (const [x, leaf] of [[206, '#3f9e4d'], [248, '#69b96a'], [330, '#2f7d4f']]) {
    polygon(ctx, [[x - 11, 330], [x + 11, 330], [x + 8, 312], [x - 8, 312]], '#b3812e');
    for (let i = -1; i <= 1; i += 1) {
      ctx.save();
      ctx.translate(x, 306);
      ctx.rotate(i * 0.5);
      ctx.fillStyle = leaf;
      ctx.beginPath();
      ctx.ellipse(0, -13, 6, 14, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  disc(ctx, 356, 292, 7, '#e05a4e');
  disc(ctx, 366, 300, 6, '#e05a4e');
  label(ctx, 'tomatoes', 361, 316, 'italic 9px Georgia', '#3f6b4f');
  // Door.
  ctx.fillStyle = '#3f6b4f';
  ctx.fillRect(268, 262, 34, 68);
  ctx.fillStyle = 'rgba(220, 244, 250, 0.9)';
  ctx.fillRect(273, 268, 24, 30);
  disc(ctx, 297, 302, 2.6, '#e0aa4e');
}

function drawButterfly(ctx, changed) {
  const wing = changed.has('butterfly') ? '#f09543' : '#8b6cc9';
  oval(ctx, 344, 142, 9, 13, wing);
  oval(ctx, 360, 142, 9, 13, wing);
  oval(ctx, 345, 156, 7, 9, wing);
  oval(ctx, 359, 156, 7, 9, wing);
  oval(ctx, 352, 149, 3.4, 11, '#3a3040');
  disc(ctx, 352, 136, 3.4, '#3a3040');
  ctx.strokeStyle = '#3a3040';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(350, 134);
  ctx.quadraticCurveTo(344, 126, 340, 128);
  ctx.moveTo(354, 134);
  ctx.quadraticCurveTo(360, 126, 364, 128);
  ctx.stroke();
}

function drawBirdhouse(ctx, changed) {
  ctx.fillStyle = '#8a6a42';
  ctx.fillRect(476, 220, 8, 112);
  // The house.
  ctx.fillStyle = '#c9752c';
  ctx.fillRect(454, 178, 52, 44);
  polygon(ctx, [[448, 178], [512, 178], [480, 154]], '#8c4a1f');
  disc(ctx, 480, 198, 9, '#4c2c10');
  ctx.fillStyle = '#8a5f1c';
  ctx.fillRect(470, 210, 20, 4);
  // The bird on its perch: flown away in the retelling.
  if (!changed.has('bird')) {
    oval(ctx, 482, 192, 8, 6.4, '#5b8fd6');
    disc(ctx, 489, 186, 4.6, '#5b8fd6');
    polygon(ctx, [[493, 186], [499, 188], [493, 190]], '#e0aa4e');
    polygon(ctx, [[474, 192], [466, 188], [474, 197]], '#3f6fb4');
    disc(ctx, 490, 185, 1.1, '#14202e');
  }
}

function drawPondAndCan(ctx, changed) {
  // Pond, bottom left.
  oval(ctx, 108, 362, 74, 24, '#7ec3ee');
  oval(ctx, 108, 360, 74, 22, '#9fd4f2');
  // Lily pads.
  disc(ctx, 76, 356, 11, '#4e9e57');
  disc(ctx, 150, 368, 9, '#4e9e57');
  disc(ctx, 118, 354, 12, '#57ab63');
  disc(ctx, 140, 350, 3.6, '#e88bb0');
  // The frog on the middle pad: hopped away in the retelling.
  if (!changed.has('frog')) {
    oval(ctx, 118, 348, 9, 7, '#3f9e4d');
    disc(ctx, 112, 341, 4, '#3f9e4d');
    disc(ctx, 124, 341, 4, '#3f9e4d');
    disc(ctx, 112, 340, 1.8, '#14202e');
    disc(ctx, 124, 340, 1.8, '#14202e');
    disc(ctx, 118, 350, 3.4, '#cdeeb9');
  }
  // The watering can by the path: carried off in the retelling.
  if (!changed.has('can')) {
    ctx.fillStyle = '#c4502f';
    roundedRectPathSafe(ctx, 238, 330, 30, 22, 4);
    ctx.fill();
    polygon(ctx, [[238, 336], [222, 326], [224, 338]], '#c4502f');
    disc(ctx, 220, 326, 4.6, '#8c3a22');
    ctx.strokeStyle = '#8c3a22';
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.arc(272, 338, 9, Math.PI * 1.1, Math.PI * 1.95);
    ctx.stroke();
    ctx.fillStyle = '#8c3a22';
    ctx.fillRect(246, 324, 12, 6);
  }
}

/** roundedRectPath, then fill — a tiny local helper so the can reads clearly. */
function roundedRectPathSafe(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

export function paintGlasshouse(ctx, changed) {
  drawSkyAndSun(ctx, changed);
  drawRainbow(ctx, changed);
  drawGround(ctx);
  drawSunflower(ctx, changed);
  drawGlasshouse(ctx);
  drawButterfly(ctx, changed);
  drawBirdhouse(ctx, changed);
  drawPondAndCan(ctx, changed);
}
