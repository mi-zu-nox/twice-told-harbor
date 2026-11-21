/* Shared canvas drawing primitives for Twice-Told Harbor.
   Every scene painter builds its picture from these small shapes, so the two
   panels of a scene always agree except where a difference changes them. */

export const PANEL_WIDTH = 540;
export const PANEL_HEIGHT = 400;

/** Fill the whole panel with a vertical gradient through the given colour stops. */
export function skyGradient(ctx, stops) {
  const gradient = ctx.createLinearGradient(0, 0, 0, PANEL_HEIGHT);
  for (const [at, colour] of stops) gradient.addColorStop(at, colour);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, PANEL_WIDTH, PANEL_HEIGHT);
}

/** A filled circle. */
export function disc(ctx, x, y, radius, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** A soft radial glow, used for lamps and the lighthouse beam's heart. */
export function glow(ctx, x, y, radius, colour) {
  const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, colour);
  gradient.addColorStop(1, 'rgba(255, 220, 130, 0)');
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

/** A filled ellipse. */
export function oval(ctx, x, y, radiusX, radiusY, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  ctx.fill();
}

/** A rounded rectangle path (not filled), ready for fill or stroke. */
export function roundedRectPath(ctx, x, y, width, height, radius) {
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

/** A filled polygon from a list of [x, y] points. */
export function polygon(ctx, points, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

/** A five-pointed star centred on (x, y). */
export function star(ctx, x, y, radius, colour) {
  ctx.fillStyle = colour;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const r = i % 2 === 0 ? radius : radius * 0.45;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** A puffy cloud made of overlapping ovals. */
export function cloud(ctx, x, y, scale, colour) {
  oval(ctx, x, y, 34 * scale, 15 * scale, colour);
  oval(ctx, x - 22 * scale, y + 4 * scale, 22 * scale, 11 * scale, colour);
  oval(ctx, x + 24 * scale, y + 4 * scale, 24 * scale, 12 * scale, colour);
  oval(ctx, x + 2 * scale, y - 8 * scale, 22 * scale, 13 * scale, colour);
}

/** A small bird silhouette: two arcs meeting at the body. */
export function gull(ctx, x, y, size, colour) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = 2.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x - size * 0.55, y, size * 0.62, Math.PI * 1.15, Math.PI * 1.95);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + size * 0.55, y, size * 0.62, Math.PI * 1.05, Math.PI * 1.85);
  ctx.stroke();
}

/** A wavy horizontal line, for water and smoke. */
export function waveLine(ctx, x, y, length, amplitude, colour, width = 2) {
  ctx.strokeStyle = colour;
  ctx.lineWidth = width;
  ctx.beginPath();
  const steps = Math.max(4, Math.floor(length / 14));
  for (let i = 0; i <= steps; i += 1) {
    const px = x + (length * i) / steps;
    const py = y + Math.sin(i * 1.7) * amplitude;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.stroke();
}

/** Centred text with a chosen font, colour and optional outline. */
export function label(ctx, text, x, y, font, colour, align = 'center') {
  ctx.font = font;
  ctx.fillStyle = colour;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}
