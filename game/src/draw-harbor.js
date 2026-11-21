/* Scene 1 painter: Lantern Harbour at dusk.
   Draws the whole scene once; `changed` holds the difference ids that the
   retelling (right panel) alters. Everything else is drawn identically. */
import { disc, glow, gull, label, oval, polygon, skyGradient, star, waveLine } from './draw-helpers.js';

const STARS = [
  [30, 90], [96, 26], [150, 120], [188, 34], [250, 84], [292, 28],
  [330, 110], [372, 44], [404, 96], [486, 118], [516, 36], [522, 140],
];

function drawSky(ctx, changed) {
  skyGradient(ctx, [[0, '#1f2c52'], [0.45, '#4a4a7d'], [0.72, '#c96a5e'], [0.88, '#e89a6a'], [1, '#e89a6a']]);
  for (const [x, y] of STARS) star(ctx, x, y, 3.2, 'rgba(255, 244, 200, 0.85)');
  if (changed.has('star')) star(ctx, 62, 40, 7, '#fff3b0');
  // The moon: a crescent in the original, full in the retelling.
  if (changed.has('moon')) {
    disc(ctx, 458, 58, 24, '#f7ead0');
    disc(ctx, 450, 50, 4, '#e3d3ae');
    disc(ctx, 466, 66, 3, '#e3d3ae');
  } else {
    disc(ctx, 458, 58, 24, '#f7ead0');
    disc(ctx, 446, 50, 20, '#2c3560');
  }
  if (!changed.has('gull')) gull(ctx, 214, 66, 15, '#1d2440');
  gull(ctx, 168, 92, 12, '#1d2440');
  gull(ctx, 268, 48, 11, '#1d2440');
}

function drawSea(ctx) {
  const gradient = ctx.createLinearGradient(0, 252, 0, 400);
  gradient.addColorStop(0, '#3d6f8e');
  gradient.addColorStop(1, '#1d3a52');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 252, 540, 148);
  for (let row = 0; row < 5; row += 1) {
    waveLine(ctx, 18 + row * 9, 272 + row * 26, 500, 2.2, 'rgba(190, 225, 240, 0.35)', 1.6);
  }
  // Moonlight path on the water.
  for (let i = 0; i < 6; i += 1) {
    waveLine(ctx, 428 + (i % 2) * 8, 262 + i * 20, 52 - i * 4, 1.6, 'rgba(250, 230, 170, 0.5)', 2);
  }
}

function drawLighthouse(ctx, changed) {
  // Rocky point.
  polygon(ctx, [[28, 258], [86, 214], [168, 222], [196, 258]], '#4c4238');
  polygon(ctx, [[86, 214], [130, 206], [168, 222], [120, 232]], '#5d5044');
  // Tower with tapering stripes.
  for (let band = 0; band < 5; band += 1) {
    const y = 208 - band * 22;
    const w = 44 - band * 2.4;
    ctx.fillStyle = band % 2 === 0 ? '#e8e2d4' : '#b8433a';
    ctx.fillRect(118 - w / 2, y - 22, w, 22);
  }
  // Gallery and lamp room.
  ctx.fillStyle = '#33302e';
  ctx.fillRect(94, 84, 48, 8);
  const lampColour = changed.has('lamp') ? '#ff7ad9' : '#ffd76a';
  glow(ctx, 118, 96, 44, changed.has('lamp') ? 'rgba(255, 122, 217, 0.55)' : 'rgba(255, 215, 106, 0.55)');
  ctx.fillStyle = '#2c2c34';
  ctx.fillRect(104, 86, 28, 20);
  disc(ctx, 118, 96, 8, lampColour);
  polygon(ctx, [[104, 86], [132, 86], [118, 72]], '#8c2f28');
  // The beam sweeping out to sea.
  ctx.fillStyle = changed.has('lamp') ? 'rgba(255, 150, 220, 0.13)' : 'rgba(255, 224, 140, 0.13)';
  polygon(ctx, [[126, 92], [330, 52], [330, 118], [126, 102]]);
  // Door and window.
  ctx.fillStyle = '#4a3220';
  ctx.fillRect(110, 182, 16, 26);
  disc(ctx, 118, 148, 5, '#ffe9a8');
}

function drawHouses(ctx, changed) {
  const houses = [
    { x: 336, w: 62, h: 58, body: '#7d5a78', roof: '#3c2c40' },
    { x: 404, w: 56, h: 72, body: '#97755a', roof: '#4c3423' },
    { x: 466, w: 60, h: 50, body: '#5f7186', roof: '#2f3c4c' },
  ];
  ctx.fillStyle = '#3a3f35';
  ctx.fillRect(320, 244, 220, 14);
  for (const house of houses) {
    const top = 252 - house.h;
    ctx.fillStyle = house.body;
    ctx.fillRect(house.x, top, house.w, house.h);
    polygon(ctx, [[house.x - 6, top], [house.x + house.w + 6, top], [house.x + house.w / 2, top - 22]], house.roof);
    ctx.fillStyle = '#2e2a26';
    ctx.fillRect(house.x + house.w / 2 - 7, 252 - 24, 14, 24);
    const windows = [[house.x + 10, top + 12], [house.x + house.w - 20, top + 12], [house.x + 10, top + 32]];
    for (const [wx, wy] of windows) {
      const isTarget = house.x === 404 && wx === house.x + 10 && wy === top + 32;
      const lit = !(isTarget && changed.has('window'));
      ctx.fillStyle = lit ? '#ffd76a' : '#3a3f4a';
      ctx.fillRect(wx, wy, 10, 12);
      ctx.strokeStyle = 'rgba(0,0,0,0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(wx, wy, 10, 12);
    }
  }
}

function drawBoat(ctx, changed) {
  // Hull.
  polygon(ctx, [[252, 300], [344, 300], [330, 326], [266, 326]], '#6e4630');
  ctx.fillStyle = '#54341f';
  ctx.fillRect(252, 296, 92, 6);
  // The painted anchor: present in the original only.
  if (!changed.has('anchor')) {
    ctx.strokeStyle = '#f3e3bb';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(296, 304);
    ctx.lineTo(296, 318);
    ctx.moveTo(290, 310);
    ctx.lineTo(302, 310);
    ctx.arc(296, 314, 6, Math.PI * 0.15, Math.PI * 0.85, true);
    ctx.stroke();
  }
  // Mast and sails.
  ctx.strokeStyle = '#3d2a18';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(298, 298);
  ctx.lineTo(298, 232);
  ctx.stroke();
  polygon(ctx, [[302, 238], [302, 294], [334, 294]], '#f1ead8');
  polygon(ctx, [[294, 244], [294, 294], [268, 294]], '#e5d9bd');
  ctx.fillStyle = '#b8433a';
  ctx.fillRect(302, 262, 30, 7);
  // Masthead flag: present in the original only.
  if (!changed.has('sailflag')) {
    polygon(ctx, [[298, 232], [314, 236], [298, 241]], '#e0aa4e');
  }
  // Reflection.
  oval(ctx, 298, 336, 40, 5, 'rgba(240, 230, 200, 0.18)');
}

function drawPier(ctx) {
  ctx.fillStyle = '#4f3a26';
  ctx.fillRect(0, 330, 210, 10);
  for (let x = 14; x < 210; x += 32) ctx.fillRect(x, 340, 8, 34);
  // Lantern post at the pier's end.
  ctx.fillRect(196, 288, 5, 44);
  glow(ctx, 198, 282, 26, 'rgba(255, 215, 106, 0.5)');
  disc(ctx, 198, 282, 6, '#ffd76a');
  ctx.fillStyle = '#2e2a26';
  ctx.fillRect(191, 272, 14, 5);
  // Rope coil and crates.
  ctx.strokeStyle = '#c9a86a';
  ctx.lineWidth = 3;
  for (let r = 4; r <= 12; r += 4) {
    ctx.beginPath();
    ctx.arc(60, 322, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#7a5a36';
  ctx.fillRect(120, 306, 26, 24);
  ctx.fillRect(128, 284, 22, 22);
  label(ctx, 'FISH', 133, 318, '700 9px Verdana', '#e8d9b0');
}

export function paintHarbor(ctx, changed) {
  drawSky(ctx, changed);
  drawSea(ctx);
  drawHouses(ctx, changed);
  drawLighthouse(ctx, changed);
  drawBoat(ctx, changed);
  drawPier(ctx);
}
