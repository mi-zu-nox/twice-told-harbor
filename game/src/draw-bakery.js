/* Scene 2 painter: the Crumb & Ember Bakery in the morning.
   Same contract as the harbour painter: draw everything once, and let the
   `changed` set alter exactly the seven differences of the retelling. */
import { cloud, disc, glow, label, oval, polygon, roundedRectPath, skyGradient, waveLine } from './draw-helpers.js';

function drawStreet(ctx) {
  skyGradient(ctx, [[0, '#a8cdea'], [0.4, '#d9ecf7'], [0.62, '#f7e8c8'], [1, '#f7e8c8']]);
  disc(ctx, 492, 44, 22, '#ffd76a');
  cloud(ctx, 120, 44, 0.8, 'rgba(255,255,255,0.9)');
  cloud(ctx, 330, 30, 0.6, 'rgba(255,255,255,0.8)');
  // Pavement and cobbles.
  ctx.fillStyle = '#cbb59a';
  ctx.fillRect(0, 330, 540, 70);
  ctx.strokeStyle = 'rgba(120, 95, 60, 0.35)';
  ctx.lineWidth = 1.4;
  for (let row = 0; row < 3; row += 1) {
    for (let x = (row % 2) * 22; x < 540; x += 44) {
      ctx.beginPath();
      ctx.arc(x, 348 + row * 20, 15, Math.PI * 0.08, Math.PI * 0.92);
      ctx.stroke();
    }
  }
}

function drawBuilding(ctx) {
  // Roof and chimney with a curl of smoke.
  polygon(ctx, [[30, 64], [510, 64], [478, 34], [62, 34]], '#8c4a3a');
  ctx.fillStyle = '#a05a48';
  ctx.fillRect(428, 8, 26, 30);
  waveLine(ctx, 436, 2, 30, 3, 'rgba(255,255,255,0.85)', 3);
  // Facade.
  ctx.fillStyle = '#f3dfba';
  ctx.fillRect(40, 64, 460, 266);
  ctx.fillStyle = '#e8cf9f';
  ctx.fillRect(40, 64, 460, 8);
  // Brick hints.
  ctx.strokeStyle = 'rgba(160, 120, 70, 0.18)';
  ctx.lineWidth = 1;
  for (let y = 92; y < 326; y += 22) {
    ctx.beginPath();
    ctx.moveTo(46, y);
    ctx.lineTo(494, y);
    ctx.stroke();
  }
}

function drawSign(ctx, changed) {
  roundedRectPath(ctx, 56, 62, 428, 40, 8);
  ctx.fillStyle = '#274b63';
  ctx.fill();
  ctx.strokeStyle = '#e0aa4e';
  ctx.lineWidth = 2;
  ctx.stroke();
  label(ctx, 'CRUMB & EMBER', 292, 83, '700 24px Georgia', '#ffe9b8');
  label(ctx, 'bakery · est. 1962', 292, 97, 'italic 10px Georgia', '#cfe0ea');
  // The pretzel knot at the sign's left end: eaten in the retelling.
  if (!changed.has('pretzel')) {
    ctx.strokeStyle = '#e8b04b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(78, 82, 8, Math.PI * 0.2, Math.PI * 1.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(90, 82, 8, Math.PI * 1.5, Math.PI * 1.1, true);
    ctx.stroke();
    disc(ctx, 84, 76, 2.4, '#fff2cf');
    disc(ctx, 79, 86, 2.4, '#fff2cf');
    disc(ctx, 89, 87, 2.4, '#fff2cf');
  }
}

function drawAwning(ctx, changed) {
  const stripes = 14;
  const width = 420 / stripes;
  for (let i = 0; i < stripes; i += 1) {
    let colour = i % 2 === 0 ? '#2e7d74' : '#f6ead6';
    if (i === 5 && changed.has('awning')) colour = '#e2725b';
    ctx.fillStyle = colour;
    polygon(ctx, [[60 + i * width, 112], [60 + (i + 1) * width, 112], [66 + (i + 1) * width, 146], [66 + i * width, 146]]);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(60, 142, 426, 5);
}

function drawWindowDisplay(ctx, changed) {
  // Window frame and glass.
  roundedRectPath(ctx, 66, 166, 238, 138, 6);
  ctx.fillStyle = '#bfe0ea';
  ctx.fill();
  ctx.strokeStyle = '#7a4a26';
  ctx.lineWidth = 5;
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(96, 292);
  ctx.lineTo(190, 178);
  ctx.stroke();
  // Shelf.
  ctx.fillStyle = '#8a5a30';
  ctx.fillRect(74, 252, 222, 8);
  ctx.fillRect(74, 296, 222, 8);
  // Loaves on the top shelf.
  for (const x of [96, 132, 240, 272]) {
    oval(ctx, x, 240, 16, 10, '#d99a4e');
    ctx.strokeStyle = '#b57a34';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(x - 8, 234);
    ctx.lineTo(x - 3, 240);
    ctx.moveTo(x, 233);
    ctx.lineTo(x + 5, 239);
    ctx.stroke();
  }
  // Croissants.
  for (const x of [196, 222]) {
    ctx.strokeStyle = '#c9822e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, 242, 8, Math.PI * 0.15, Math.PI * 0.95);
    ctx.stroke();
  }
  // The celebration cake on its stand, lower shelf.
  ctx.fillStyle = '#9db8c4';
  ctx.fillRect(146, 288, 6, 10);
  ctx.fillRect(128, 296, 42, 4);
  oval(ctx, 149, 284, 26, 7, '#f6ead6');
  ctx.fillStyle = '#e88bb0';
  ctx.fillRect(126, 262, 46, 20);
  ctx.fillStyle = '#fdf6ec';
  ctx.fillRect(126, 262, 46, 6);
  for (let x = 133; x <= 165; x += 8) disc(ctx, x, 282, 2.6, '#c4502f');
  // Its cherry: vanished in the retelling.
  if (!changed.has('cherry')) {
    disc(ctx, 148, 254, 6, '#c0272d');
    ctx.strokeStyle = '#2f7d4f';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(148, 250);
    ctx.quadraticCurveTo(154, 242, 160, 244);
    ctx.stroke();
  }
  // Jars of jam on the lower shelf.
  for (const x of [92, 226, 258]) {
    ctx.fillStyle = '#a63d5c';
    ctx.fillRect(x, 272, 16, 24);
    ctx.fillStyle = '#e0aa4e';
    ctx.fillRect(x - 1, 268, 18, 5);
  }
}

function drawDoorAndCat(ctx, changed) {
  // Door.
  roundedRectPath(ctx, 378, 168, 96, 162, 6);
  ctx.fillStyle = '#3f6b4f';
  ctx.fill();
  ctx.strokeStyle = '#2c4c38';
  ctx.lineWidth = 3;
  ctx.stroke();
  roundedRectPath(ctx, 396, 184, 60, 62, 5);
  ctx.fillStyle = '#bfe0ea';
  ctx.fill();
  disc(ctx, 462, 258, 4.5, '#e0aa4e');
  // Wreath on the door, and its bow.
  ctx.strokeStyle = '#2f7d4f';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(426, 196, 15, 0, Math.PI * 2);
  ctx.stroke();
  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2;
    disc(ctx, 426 + Math.cos(angle) * 15, 196 + Math.sin(angle) * 15, 2.6, i % 2 ? '#c0272d' : '#e0aa4e');
  }
  if (!changed.has('wreathbow')) {
    polygon(ctx, [[430, 208], [420, 200], [420, 214]], '#c0272d');
    polygon(ctx, [[430, 208], [440, 200], [440, 214]], '#c0272d');
    disc(ctx, 430, 208, 3.2, '#8c1d22');
  }
  // The bakery cat, sitting by the door.
  oval(ctx, 455, 322, 17, 13, '#5a4632');
  disc(ctx, 455, 302, 11, '#5a4632');
  polygon(ctx, [[446, 296], [449, 284], [454, 294]], '#5a4632');
  polygon(ctx, [[456, 294], [461, 284], [464, 296]], '#5a4632');
  disc(ctx, 451, 301, 1.8, '#ffe9a8');
  disc(ctx, 459, 301, 1.8, '#ffe9a8');
  ctx.strokeStyle = '#5a4632';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(470, 328);
  ctx.quadraticCurveTo(486, 322, 484, 308);
  ctx.stroke();
  // Its teal scarf: lost in the retelling.
  if (!changed.has('scarf')) {
    ctx.strokeStyle = '#2e7d74';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(455, 310, 9, Math.PI * 0.15, Math.PI * 0.95);
    ctx.stroke();
    ctx.fillStyle = '#2e7d74';
    ctx.fillRect(462, 312, 6, 12);
  }
  // Welcome mat.
  ctx.fillStyle = '#a63d5c';
  ctx.fillRect(398, 332, 62, 8);
}

function drawBicycle(ctx, changed) {
  ctx.strokeStyle = '#37424e';
  ctx.lineWidth = 3.4;
  for (const x of [84, 152]) {
    ctx.beginPath();
    ctx.arc(x, 334, 24, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(84, 334);
  ctx.lineTo(112, 302);
  ctx.lineTo(152, 334);
  ctx.moveTo(112, 302);
  ctx.lineTo(146, 302);
  ctx.moveTo(146, 302);
  ctx.lineTo(152, 334);
  ctx.moveTo(108, 296);
  ctx.lineTo(122, 296);
  ctx.stroke();
  ctx.fillStyle = '#8c2f28';
  ctx.fillRect(104, 292, 20, 5);
  // Basket over the front wheel, with its flowers.
  ctx.fillStyle = '#b3812e';
  polygon(ctx, [[66, 288], [98, 288], [93, 310], [71, 310]]);
  ctx.strokeStyle = '#8a5f1c';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(68, 296);
  ctx.lineTo(96, 296);
  ctx.moveTo(70, 303);
  ctx.lineTo(94, 303);
  ctx.stroke();
  if (!changed.has('flowers')) {
    disc(ctx, 74, 284, 5, '#e88bb0');
    disc(ctx, 84, 280, 5.6, '#c4502f');
    disc(ctx, 93, 284, 5, '#e0aa4e');
    disc(ctx, 84, 284, 2.2, '#fff2cf');
  }
}

function drawLamp(ctx, changed) {
  ctx.fillStyle = '#2e3438';
  ctx.fillRect(499, 190, 5, 140);
  ctx.fillRect(488, 330, 26, 6);
  polygon(ctx, [[486, 168], [518, 168], [508, 152], [496, 152]], '#2e3438');
  if (!changed.has('lampglow')) glow(ctx, 502, 176, 30, 'rgba(255, 215, 106, 0.55)');
  disc(ctx, 502, 176, 7, changed.has('lampglow') ? '#9aa4ab' : '#ffd76a');
  ctx.fillStyle = '#2e3438';
  ctx.fillRect(496, 160, 12, 4);
}

export function paintBakery(ctx, changed) {
  drawStreet(ctx);
  drawBuilding(ctx);
  drawSign(ctx, changed);
  drawAwning(ctx, changed);
  drawWindowDisplay(ctx, changed);
  drawDoorAndCat(ctx, changed);
  drawBicycle(ctx, changed);
  drawLamp(ctx, changed);
}
