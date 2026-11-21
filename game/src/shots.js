/* Screenshot staging for Twice-Told Harbor, behind ?shot=<name>.
   Each name freezes the game in a real, reachable state — some differences
   found and ringed, several still hidden, the counter mid-count — so the
   maker's screenshots are honest renders of the game being played.
   Names: harbour (the cover), bakery, glasshouse, finale. */
import { SCENES } from './scenes.js';
import { startScene } from './game.js';

function markFound(game, scene, ids, now) {
  for (const id of ids) {
    game.found.add(id);
    game.foundAt.set(id, now - 1200);
  }
  void scene;
}

/** Put `game` into the named screenshot state. Unknown names stage the cover. */
export function stageShot(game, name, now) {
  if (name === 'bakery') {
    startScene(game, 1, now);
    markFound(game, SCENES[1], ['pretzel', 'awning'], now);
    game.score = 830;
    game.hintsLeft = 2;
    game.hintId = 'cherry';
    game.hintUntil = now + 60000;
    game.timeLeft = 64;
    game.focus = { x: 330, y: 210 };
    game.message = 'Two found at the bakery — and a hint shimmers by the cake.';
    return;
  }
  if (name === 'glasshouse') {
    startScene(game, 2, now);
    markFound(game, SCENES[2], ['sunface', 'rainbow', 'sunflower', 'can'], now);
    game.score = 1740;
    game.hintsLeft = 1;
    game.timeLeft = 47;
    game.focus = { x: 352, y: 148 };
    game.message = 'Four found in the glasshouse garden. Three still hide.';
    return;
  }
  if (name === 'finale') {
    startScene(game, 2, now);
    markFound(game, SCENES[2], SCENES[2].differences.map((d) => d.id), now);
    game.score = 3120;
    game.timeLeft = 38;
    game.status = 'won';
    game.message = 'Every difference in the harbour has been told. Final score: 3120.';
    game.messageKind = 'good';
    return;
  }
  // The cover: the harbour at dusk, three differences ringed, four to go.
  startScene(game, 0, now);
  markFound(game, SCENES[0], ['lamp', 'moon', 'window'], now);
  game.score = 450;
  game.timeLeft = 78;
  game.focus = { x: 300, y: 280 };
  game.message = 'Three differences ringed in gold. Four still hide in the retelling.';
}
