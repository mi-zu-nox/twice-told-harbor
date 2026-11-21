// Twice-Told Harbor — the hand-in program (Node 22, standard library only).
//
// The game itself is the static site in game/: two canvas panels, three
// hand-drawn scenes, twenty-one differences, and no network request. This
// program's one job is to hand it in the way the bounty asks: copy game/ and
// screenshots/ into the output directory and write dossier.json there with
// the vendored make.fun library, so the grader's own build of the dossier
// matches byte for byte. It is deterministic — the same repository always
// produces the same output bytes.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Play the game locally with: node serve.ts  (then open the printed address)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'game'), join(outputDir, 'game'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps are the gate's own: at most 4 screenshots of 256 KiB each, at
// most 993 entries and 48 MiB under game/, no path over 1000 bytes, and the
// dossier text capped at 160 KiB. Passing them here means this program
// refuses exactly what the scorer would refuse.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outputDir, 'dossier.json'), dossier);
