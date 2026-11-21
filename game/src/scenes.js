/* The three scenes of Twice-Told Harbor and the seven differences hidden in
   each retelling. A difference names where it sits in panel coordinates
   (540 by 400), how large a click target it has, and the words the game
   speaks when it is found. The painters in the draw-*.js files read the same
   ids: on the right-hand panel every id in the list is "changed". */

export const SCENES = [
  {
    id: 'harbour',
    title: 'Lantern Harbour',
    subtitle: 'Scene 1 of 3 — Lantern Harbour at dusk',
    intro: 'Scene 1 of 3 — Lantern Harbour at dusk. Seven things have changed in the retelling.',
    seconds: 120,
    differences: [
      { id: 'lamp', x: 118, y: 96, r: 26, found: 'The lighthouse lamp burns rose-pink in the retelling, not gold.' },
      { id: 'moon', x: 458, y: 58, r: 30, found: 'The crescent moon has filled out into a full moon.' },
      { id: 'gull', x: 214, y: 66, r: 22, found: 'One of the three gulls has flown out of the story.' },
      { id: 'star', x: 62, y: 40, r: 18, found: 'A new star has been wished into the evening sky.' },
      { id: 'window', x: 412, y: 216, r: 20, found: 'A harbour house has put out one of its lights.' },
      { id: 'sailflag', x: 307, y: 232, r: 18, found: 'The little flag at the masthead is gone.' },
      { id: 'anchor', x: 296, y: 312, r: 17, found: 'The anchor painted on the hull has been scrubbed away.' },
    ],
  },
  {
    id: 'bakery',
    title: 'Crumb & Ember Bakery',
    subtitle: 'Scene 2 of 3 — morning at the bakery',
    intro: 'Scene 2 of 3 — morning at the Crumb & Ember Bakery. Seven small changes this time.',
    seconds: 110,
    differences: [
      { id: 'pretzel', x: 84, y: 82, r: 19, found: 'The pretzel on the baker\u2019s sign has been eaten.' },
      { id: 'awning', x: 219, y: 128, r: 21, found: 'One stripe of the awning has turned coral.' },
      { id: 'cherry', x: 148, y: 254, r: 16, found: 'The cherry on the celebration cake has vanished.' },
      { id: 'lampglow', x: 502, y: 176, r: 21, found: 'The street lamp has been put out for the day.' },
      { id: 'wreathbow', x: 430, y: 208, r: 16, found: 'The bow on the door wreath has come undone.' },
      { id: 'flowers', x: 82, y: 292, r: 19, found: 'The flowers in the bicycle basket have been picked.' },
      { id: 'scarf', x: 455, y: 316, r: 18, found: 'The bakery cat has lost its teal scarf.' },
    ],
  },
  {
    id: 'glasshouse',
    title: 'The Glasshouse Garden',
    subtitle: 'Scene 3 of 3 — noon in the glasshouse garden',
    intro: 'Scene 3 of 3 — noon in the Glasshouse Garden. The last seven changes are the sneakiest.',
    seconds: 100,
    differences: [
      { id: 'sunface', x: 68, y: 56, r: 27, found: 'The sun has stopped smiling.' },
      { id: 'butterfly', x: 352, y: 148, r: 18, found: 'The butterfly has changed its wings from violet to orange.' },
      { id: 'rainbow', x: 430, y: 122, r: 30, found: 'The rainbow has lost its green band.' },
      { id: 'sunflower', x: 94, y: 208, r: 25, found: 'The sunflower\u2019s seeds have turned to plain gold.' },
      { id: 'bird', x: 480, y: 192, r: 17, found: 'The bird on the birdhouse roof has flown away.' },
      { id: 'can', x: 252, y: 340, r: 20, found: 'Someone has carried off the watering can.' },
      { id: 'frog', x: 118, y: 354, r: 18, found: 'The frog has hopped off its lily pad.' },
    ],
  },
];

/** The ids of a scene's differences, as a set the painters can test. */
export function differenceIds(scene) {
  return new Set(scene.differences.map((difference) => difference.id));
}
