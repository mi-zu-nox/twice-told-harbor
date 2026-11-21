/* Twice-Told Harbor: boot, the render loop and the HUD.
   The game rules live in game.js, the pictures in the draw-*.js painters;
   this file connects them to the page and keeps the counters honest. */
import { createGame, currentScene, differencesLeft, guess, spendHint, startScene, tick } from './game.js';
import { SCENES } from './scenes.js';
import { renderPanel } from './render.js';
import { attachInput } from './input.js';
import { createSound } from './sound.js';
import { stageShot } from './shots.js';

const elements = {
  left: document.getElementById('panel-left'),
  right: document.getElementById('panel-right'),
  foundCount: document.getElementById('found-count'),
  pips: document.getElementById('pips'),
  toGo: document.getElementById('to-go'),
  timeFill: document.getElementById('time-fill'),
  timeLeft: document.getElementById('time-left'),
  score: document.getElementById('score'),
  hintsLeft: document.getElementById('hints-left'),
  hintButton: document.getElementById('hint-button'),
  soundButton: document.getElementById('sound-button'),
  restartButton: document.getElementById('restart-button'),
  message: document.getElementById('message'),
  banner: document.getElementById('banner'),
  bannerTitle: document.getElementById('banner-title'),
  bannerText: document.getElementById('banner-text'),
  bannerButton: document.getElementById('banner-button'),
  tabs: [...document.querySelectorAll('.tab')],
};

const game = createGame();
const sound = createSound();
const shotName = new URLSearchParams(window.location.search).get('shot');
const frozen = shotName !== null;

startScene(game, 0, performance.now());
if (frozen) stageShot(game, shotName, performance.now());

function updateHud() {
  const scene = currentScene(game);
  elements.foundCount.textContent = String(game.found.size);
  elements.toGo.textContent = String(differencesLeft(game));
  elements.score.textContent = String(game.score);
  elements.hintsLeft.textContent = String(game.hintsLeft);
  elements.hintButton.disabled = game.hintsLeft <= 0 || game.status !== 'playing';
  elements.timeLeft.textContent = String(Math.ceil(game.timeLeft));
  const share = Math.max(0, game.timeLeft / scene.seconds);
  elements.timeFill.style.width = (share * 100).toFixed(1) + '%';
  elements.timeFill.classList.toggle('low', share < 0.25);
  elements.pips.innerHTML = '';
  for (const difference of scene.differences) {
    const pip = document.createElement('span');
    pip.className = 'pip' + (game.found.has(difference.id) ? ' on' : '');
    elements.pips.appendChild(pip);
  }
  elements.tabs.forEach((tab, index) => {
    tab.classList.toggle('active', index === game.sceneIndex);
    tab.classList.toggle('done', index < game.sceneIndex || game.status === 'won');
  });
  elements.message.textContent = game.message;
  elements.message.className = game.messageKind;
  if (game.status === 'playing') {
    elements.banner.hidden = true;
  } else {
    elements.banner.hidden = false;
    if (game.status === 'scene-complete') {
      elements.bannerTitle.textContent = 'Scene complete!';
      elements.bannerText.textContent =
        currentScene(game).title + ' is told, every difference found. Score so far: ' + game.score + '.';
      elements.bannerButton.textContent = 'Begin ' + SCENES[game.sceneIndex + 1].title;
    } else if (game.status === 'won') {
      elements.bannerTitle.textContent = 'The harbour is fully told!';
      elements.bannerText.textContent =
        'All three scenes, all twenty-one differences. Final score: ' + game.score + '.';
      elements.bannerButton.textContent = 'Play again';
    } else {
      elements.bannerTitle.textContent = 'The light has run out';
      elements.bannerText.textContent =
        'Time is up on ' + currentScene(game).title + ', with ' + differencesLeft(game) + ' differences still hiding.';
      elements.bannerButton.textContent = 'Try the scene again';
    }
  }
}

function frame(now) {
  if (!frozen) tick(game, now);
  const leftCtx = elements.left.getContext('2d');
  const rightCtx = elements.right.getContext('2d');
  renderPanel(leftCtx, game, 'left', now);
  renderPanel(rightCtx, game, 'right', now);
  updateHud();
  requestAnimationFrame(frame);
}

attachInput([elements.left, elements.right], game, {
  onGuess(x, y) {
    const result = guess(game, x, y, performance.now());
    if (result === 'found') {
      if (game.status === 'won') sound.playGameWin();
      else if (game.status === 'scene-complete') sound.playSceneWin();
      else sound.playFind();
    } else if (result === 'miss') {
      sound.playMiss();
    }
  },
  onHint() {
    if (spendHint(game, performance.now())) sound.playHint();
  },
  onRestart() {
    startScene(game, game.sceneIndex, performance.now());
  },
  onToggleSound() {
    elements.soundButton.textContent = 'Sound: ' + (sound.toggle() ? 'on' : 'off');
  },
});

elements.hintButton.addEventListener('click', () => {
  if (spendHint(game, performance.now())) sound.playHint();
});
elements.soundButton.addEventListener('click', () => {
  elements.soundButton.textContent = 'Sound: ' + (sound.toggle() ? 'on' : 'off');
});
elements.restartButton.addEventListener('click', () => {
  startScene(game, game.sceneIndex, performance.now());
});
elements.bannerButton.addEventListener('click', () => {
  if (game.status === 'scene-complete') {
    startScene(game, game.sceneIndex + 1, performance.now());
  } else if (game.status === 'won') {
    game.score = 0;
    startScene(game, 0, performance.now());
  } else if (game.status === 'lost') {
    startScene(game, game.sceneIndex, performance.now());
  }
});

requestAnimationFrame(frame);
