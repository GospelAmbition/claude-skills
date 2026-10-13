// Scene specs. `id` must match an entry in narration.json (audio/<id>.wav).
// Times are seconds relative to the start of that scene's narration. build(w) receives
// w('word', offset = 0, nth = 1) → when that word is spoken (from TTS word timestamps).
// Page coordinates are CSS px of the 1440px-wide captures; `h` is the capture's CSS height (png height / 2).
//
// Scene types
//   title   { kicker, head, chips: [{ n, label, at }] }
//   custom  { html }  — diagram; elements with data-at="word|word+0.3|word#2|1.5" reveal on that word,
//                       data-anim = up|left|right|pop|fade|draw|fill|strike, data-dist, data-dur
//   chapter { num, title }
//   screen  { kicker, head, subs: [[text, at]], url, imgs: [{ at, src, h, url? }],
//             cam: [{ at, z, x, y }], cur: [{ at, x, y }], click: [at], hl: [{ a, b, x, y, w, h, tag?, tagPos? }] }
//             plus top-level `chapter: <index into CHAPTERS>` for the bottom progress bar
//   outro   { head, headAt: [at per word], cols: [{ n, t, d, at }] }
//
// Use END for "until the scene ends". Keyframes must be in time order (engine reports errors).
const END = 99
const CHAPTERS = ['Create', 'Manage', 'Grow']

const SCENES = [
  { id: 's01_title', type: 'title', build: w => ({
    kicker: 'Product · Feature', head: 'Big punchy<br>title.',
    chips: [{ n: '01', label: 'First chapter', at: w('first') }, { n: '02', label: 'Second chapter', at: w('second') }]
  }) },

  { id: 's02_model', type: 'custom', build: () => ({ html: `
    <div class="card" style="left:120px; top:190px; width:860px; height:700px; padding:44px 48px" data-at="0.1" data-dist="40">
      <div class="lab acc">Concept</div>
      <div class="big" style="margin-top:18px">Name of the thing</div>
      <div style="margin-top:30px">
        <span class="pill" data-at="part" data-dist="16">part one</span>
        <span class="pill" data-at="part#2" data-dist="16">part two</span>
      </div>
      <div class="line" style="left:48px; top:440px; width:764px" data-at="timeline" data-anim="draw" data-dur="0.9"></div>
    </div>
    <div style="position:absolute; left:1040px; top:190px" data-at="answers" data-anim="left">
      <div class="big">A thing = <span class="acc">N answers</span></div>
    </div>
    <div class="row" style="left:1040px; top:290px; width:760px; height:88px" data-at="first" data-anim="right" data-dist="40">
      <span class="lab acc" style="width:132px">START</span><span class="opt" data-at="first+0.3" data-anim="fill">Selected option</span><span class="opt">Other</span>
    </div>` }) },

  { id: 's03_ch1', type: 'chapter', build: () => ({ num: '01', title: 'First chapter' }) },

  { id: 's04_example', type: 'screen', chapter: 0, build: w => ({
    kicker: '01 · Create', head: 'Short punchy headline.',
    subs: [['One supporting point', w('point')]],
    url: 'localhost:3000/path',
    imgs: [{ at: -1, src: '01_list', h: 900 }, { at: w('opens', .15), src: '02_detail', h: 900, url: 'localhost:3000/path/new' }],
    cam: [{ at: -1, z: 1.0, x: 720, y: 450 }, { at: w('button', -.4), z: 1.6, x: 1100, y: 250 }, { at: END, z: 1.3, x: 748, y: 430 }],
    cur: [{ at: -1, x: 820, y: 560 }, { at: w('button', -.1), x: 1208, y: 116 }],
    click: [w('opens', -.12)],
    hl: [{ a: w('explains'), b: END, x: 426, y: 250, w: 640, h: 178, tag: 'Optional label' }]
  }) },

  { id: 's05_outro', type: 'outro', build: w => ({
    head: 'Create. Manage. Grow.', headAt: [w('Create'), w('manage'), w('grow')],
    cols: [{ n: '01', t: 'Create', d: 'One-line recap', at: w('Create') },
      { n: '02', t: 'Manage', d: 'One-line recap', at: w('manage') },
      { n: '03', t: 'Grow', d: 'One-line recap', at: w('grow') }]
  }) }
]
