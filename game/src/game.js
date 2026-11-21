/* The rules of Twice-Told Harbor, with no drawing and no DOM: which scene we
   are in, what has been found, the clock, the score, hints and mistakes.
   main.js renders this state and feeds it clicks and keys. */
import { SCENES } from './scenes.js';

export const POINTS_PER_FIND = 100;
export const MISS_TIME_PENALTY = 3;
export const HINT_COST = 25;
export const HINTS_PER_SCENE = 3;

/** A fresh game at the first scene. */
export function createGame() {
  const game = {
    sceneIndex: 0,
    score: 0,
    status: 'playing', // playing | scene-complete | won | lost
    found: new Set(),
    foundAt: new Map(),
    hintsLeft: HINTS_PER_SCENE,
    hintId: null,
    hintUntil: 0,
    miss: null,
    focus: { x: 270, y: 200 },
    sceneStartedAt: 0,
    penaltySeconds: 0,
    timeLeft: SCENES[0].seconds,
    message: SCENES[0].intro,
    messageKind: '',
  };
  return game;
}

export function currentScene(game) {
  return SCENES[game.sceneIndex];
}

export function differencesLeft(game) {
  return currentScene(game).differences.length - game.found.size;
}

/** Start (or restart) the scene at `index`, keeping the score so far. */
export function startScene(game, index, now) {
  game.sceneIndex = index;
  game.found = new Set();
  game.foundAt = new Map();
  game.hintsLeft = HINTS_PER_SCENE;
  game.hintId = null;
  game.miss = null;
  game.status = 'playing';
  game.sceneStartedAt = now;
  game.penaltySeconds = 0;
  game.timeLeft = SCENES[index].seconds;
  game.focus = { x: 270, y: 200 };
  game.message = SCENES[index].intro;
  game.messageKind = '';
}

/** The difference under a point, or null. Found ones still count as hits. */
export function differenceAt(game, x, y) {
  for (const difference of currentScene(game).differences) {
    const dx = x - difference.x;
    const dy = y - difference.y;
    if (dx * dx + dy * dy <= difference.r * difference.r) return difference;
  }
  return null;
}

/**
 * Judge a guess at (x, y) on either panel. Returns 'found', 'already' or
 * 'miss' and updates score, clock and message.
 */
export function guess(game, x, y, now) {
  if (game.status !== 'playing') return 'idle';
  const difference = differenceAt(game, x, y);
  if (difference && !game.found.has(difference.id)) {
    game.found.add(difference.id);
    game.foundAt.set(difference.id, now);
    const timeBonus = Math.round(game.timeLeft / 10);
    game.score += POINTS_PER_FIND + timeBonus;
    game.message = difference.found + (differencesLeft(game) > 0
      ? ' ' + differencesLeft(game) + ' to go.'
      : '');
    game.messageKind = 'good';
    if (differencesLeft(game) === 0) {
      game.score += Math.round(game.timeLeft) * 2;
      game.status = game.sceneIndex === SCENES.length - 1 ? 'won' : 'scene-complete';
      game.message = game.status === 'won'
        ? 'Every difference in the harbour has been told. Final score: ' + game.score + '.'
        : 'Scene complete! Bonus for the light left over. Score: ' + game.score + '.';
    }
    return 'found';
  }
  if (difference) {
    game.message = 'Already found — that ring is yours.';
    game.messageKind = '';
    return 'already';
  }
  game.penaltySeconds += MISS_TIME_PENALTY;
  game.timeLeft = Math.max(0, game.timeLeft - MISS_TIME_PENALTY);
  game.miss = { x, y, at: now };
  game.message = 'Not a difference — the light burns 3 seconds faster.';
  game.messageKind = 'bad';
  if (game.timeLeft <= 0) game.status = 'lost';
  return 'miss';
}

/** Spend a hint: shimmer one unfound difference for a moment. */
export function spendHint(game, now) {
  if (game.status !== 'playing' || game.hintsLeft <= 0) return null;
  const remaining = currentScene(game).differences.filter((d) => !game.found.has(d.id));
  if (remaining.length === 0) return null;
  const pick = remaining[Math.floor((now / 1000) % remaining.length)];
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_COST);
  game.hintId = pick.id;
  game.hintUntil = now + 1400;
  game.message = 'A hint shimmers somewhere in the scene…';
  game.messageKind = '';
  return pick;
}

/** Advance the clock; returns true when time just ran out. */
export function tick(game, now) {
  if (game.status !== 'playing') return false;
  const elapsed = (now - game.sceneStartedAt) / 1000;
  const scene = currentScene(game);
  const before = game.timeLeft;
  game.timeLeft = Math.max(0, scene.seconds - elapsed - game.penaltySeconds);
  if (game.timeLeft <= 0 && before > 0) {
    game.status = 'lost';
    game.message = 'The light has run out on ' + scene.title + '. Try the scene again.';
    game.messageKind = 'bad';
    return true;
  }
  return false;
}
