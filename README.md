# twice-told-harbor

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mi-zu-nox/twice-told-harbor/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/mi-zu-nox/twice-told-harbor/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twice-Told Harbor** is an original spot-the-difference game. Every scene is
told twice: a harbour at dusk, a bakery in the morning, a glasshouse garden
at noon. The retelling changes exactly seven details — a lamp that burns
pink instead of gold, a cherry that leaves a cake, a sun that stops smiling.
Find them all before the light runs out.

- Three hand-drawn canvas scenes, seven differences each, fair but hidden:
  colour changes, vanished objects, one extra star.
- Click a difference in either picture, or steer the brass ring with the
  arrow keys and press Enter. Wrong guesses cost 3 seconds.
- A countdown with a visible time bar, a score with time bonuses, three
  hints per scene, and synthesized sound effects — no files, no network.
- Plain static files under `game/`: open `game/index.html` in a desktop
  browser, or serve the folder with any static server.

## Run it

```sh
node serve.ts
```

then open http://localhost:8080 — or serve `game/` with any static file
server. To produce the entry output exactly as the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Layout

- `main.ts` — the hand-in program: copies `game/` and `screenshots/` to the
  output directory and writes `dossier.json` with the vendored library.
- `game/src/scenes.js` — the three scenes and their difference lists.
- `game/src/draw-harbor.js`, `draw-bakery.js`, `draw-glasshouse.js` — the
  scene painters; each draws its scene once and applies the retelling's
  changes from the same difference ids.
- `game/src/game.js` — the rules: clock, score, hints, mistakes.
- `game/src/render.js`, `input.js`, `sound.js`, `shots.js`, `main.js` —
  panel rendering and markers, mouse and keyboard, synthesized sounds,
  screenshot staging, and the page wiring.
- `vendor/makefun-game.ts` — the make.fun dossier library, unmodified.

---

<sub>Entered on [make.fun](https://make.fun/?ref=05n6g5n0&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
