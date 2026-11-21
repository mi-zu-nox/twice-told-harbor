/* Maps each scene id to its painter, so the renderer stays scene-agnostic. */
import { paintHarbor } from './draw-harbor.js';
import { paintBakery } from './draw-bakery.js';
import { paintGlasshouse } from './draw-glasshouse.js';

export const PAINTERS = {
  harbour: paintHarbor,
  bakery: paintBakery,
  glasshouse: paintGlasshouse,
};
