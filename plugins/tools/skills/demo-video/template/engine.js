// Deterministic renderer: render(t) sets every element from the global time t (seconds).
// Scene types: title, custom, chapter, screen, outro (see scenes.js).
const VP_W = 1244, VP_H = 778, PAGE_W = 1440, K0 = VP_W / PAGE_W
const PAD = { title: [1.0, 1.3], custom: [0.5, 1.2], chapter: [0.35, 0.9], screen: [0.45, 0.75], outro: [0.5, 3.2] }
window.__errors = []

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a, b, p) => a + (b - a) * p
const eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
const eo = p => 1 - Math.pow(1 - p, 3)
const eoq = p => 1 - Math.pow(1 - p, 5)
const eback = p => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2) }
const $ = id => document.getElementById(id)
const norm = s => s.toLowerCase().replace(/[^a-z0-9]/g, '')

// ── timeline ────────────────────────────────────────────────────────────
function resolver(id) {
  const toks = (WORDS[id] || []).map(([t, a]) => [norm(t), a]).filter(([t]) => t)
  return (word, off = 0, nth = 1) => {
    const q = norm(word)
    let hits = toks.filter(([t]) => t === q)
    if (hits.length < nth) hits = toks.filter(([t]) => t.length >= 3 && (t.startsWith(q) || q.startsWith(t)))
    if (hits.length < nth) { window.__errors.push(`${id}: word "${word}" #${nth} not found`); return 0 }
    return hits[nth - 1][1] + off
  }
}
// data-at="word" | "word+0.3" | "word#2" | "word#2-0.2" | "1.5" (seconds)
function parseAt(w, s) {
  if (/^-?[\d.]+$/.test(s)) return +s
  const m = s.match(/^([^#+]+?)(?:#(\d+))?([+-][\d.]+)?$/)
  return m ? w(m[1], m[3] ? +m[3] : 0, m[2] ? +m[2] : 1) : 0
}
let T = 0
const TL = SCENES.map((s) => {
  if (!(s.id in TIMING)) window.__errors.push(`${s.id}: no audio timing`)
  const [lead, tail] = PAD[s.type]
  const A = TIMING[s.id] || 2
  const w = resolver(s.id)
  const spec = s.build(w)
  const e = { ...s, spec, w, lead, tail, A, start: T, dur: lead + A + tail }
  T += e.dur
  return e
})
TL.forEach((e, i) => {
  e.prev = TL[i - 1]; e.next = TL[i + 1]
  for (const k of ['cam', 'cur', 'imgs']) (e.spec[k] || []).forEach((x, j, a) => { if (j && x.at < a[j - 1].at) window.__errors.push(`${e.id}: ${k}[${j}] out of order (${a[j - 1].at.toFixed(2)} > ${x.at.toFixed(2)})`) })
})
const TOTAL = T
window.TIMELINE = TL.map(e => ({ id: e.id, start: +e.start.toFixed(3), lead: e.lead, dur: +e.dur.toFixed(3), A: e.A }))
window.TOTAL = TOTAL

// ── helpers ─────────────────────────────────────────────────────────────
const pick = (k, fields) => Object.fromEntries(fields.map(f => [f, k[f]]))
function keyed(keys, u, fields) {
  if (!keys || !keys.length) return null
  if (u <= keys[0].at) return pick(keys[0], fields)
  for (let i = 1; i < keys.length; i++) {
    if (u <= keys[i].at) {
      const a = keys[i - 1], b = keys[i]
      const p = eio(clamp((u - a.at) / Math.max(.001, b.at - a.at)))
      const o = {}
      for (const f of fields) o[f] = lerp(a[f], b[f], p)
      return o
    }
  }
  return pick(keys[keys.length - 1], fields)
}

// Places page point (cam.x, cam.y) at the viewport centre, clamped to the page edges.
function camXform(cam, h) {
  const k = K0 * cam.z
  let tx = VP_W / 2 - cam.x * k, ty = VP_H / 2 - cam.y * k
  tx = clamp(tx, VP_W - PAGE_W * k, 0)
  ty = clamp(ty, Math.min(0, VP_H - h * k), 0)
  return { k, tx, ty }
}

function wordsHTML(html) {
  return html.split(/(<br>)/).map(part => part === '<br>' ? '<br>' : part.split(' ').filter(Boolean).map(x => `<span class="w"><span>${x}</span></span>`).join(' ')).join('')
}

function animWords(el, lt, start, stagger = .05, dist = 1.05) {
  el.querySelectorAll('.w > span').forEach((s, i) => {
    const p = eoq(clamp((lt - start - i * stagger) / .6))
    s.style.transform = `translateY(${(1 - p) * dist * 100}%)`
    s.style.opacity = p
  })
}

// ── layers ──────────────────────────────────────────────────────────────
const layers = { title: $('L-title'), custom: $('L-custom'), chapter: $('L-chapter'), screen: $('L-screen'), outro: $('L-outro') }
const imgs = [$('im0'), $('im1'), $('im2'), $('im3')]
const setSrc = (img, src) => { const want = `shots/${src}.png`; if (img.getAttribute('src') !== want) img.setAttribute('src', want) }

const built = {}
function buildOnce(e, key, fn) { if (built[key] !== e.id) { fn(); built[key] = e.id } }

$('chapters').innerHTML = (typeof CHAPTERS !== 'undefined' ? CHAPTERS : []).map(c => `<div class="chap"><div class="bar"><i></i></div><div class="lbl">${c}</div></div>`).join('')

function screenState(e, u) {
  const sp = e.spec
  const cam = keyed(sp.cam, u, ['z', 'x', 'y'])
  const draw = []
  sp.imgs.forEach((im, i) => {
    if (u < im.at) return
    const op = i === 0 ? 1 : eo(clamp((u - im.at) / .35))
    if (op >= 1) draw.length = 0
    draw.push({ src: im.src, h: im.h, op, url: im.url })
  })
  if (!draw.length) draw.push({ src: sp.imgs[0].src, h: sp.imgs[0].h, op: 1, url: sp.imgs[0].url })
  return { cam, draw }
}

function renderScreen(e, lt) {
  const sp = e.spec, u = lt - e.lead
  const prevScreen = e.prev && e.prev.type === 'screen', nextScreen = e.next && e.next.type === 'screen'
  const lin = prevScreen ? 1 : eo(clamp(lt / .7))
  const lout = nextScreen ? 1 : eo(clamp((e.dur - lt) / .55))
  const wv = Math.min(lin, lout)
  layers.screen.style.opacity = wv
  $('win').style.transform = `translateY(${(1 - wv) * 60}px) scale(${.965 + .035 * wv})`

  // viewport images; the previous screen scene's last frame sits underneath while this one fades in
  let stack = []
  const cur = screenState(e, u)
  if (prevScreen && lt < .5) {
    const pe = e.prev, ps = screenState(pe, pe.dur - pe.lead)
    stack.push({ ...ps.draw[ps.draw.length - 1], op: 1, cam: ps.cam })
    const f = eo(clamp(lt / .45))
    cur.draw.forEach(d => stack.push({ ...d, op: d.op * f, cam: cur.cam }))
  } else cur.draw.forEach(d => stack.push({ ...d, cam: cur.cam }))
  stack = stack.slice(-4)
  imgs.forEach((img, i) => {
    const d = stack[i]
    if (!d) { img.style.display = 'none'; return }
    img.style.display = 'block'
    setSrc(img, d.src)
    const x = camXform(d.cam, d.h)
    img.style.width = PAGE_W + 'px'; img.style.height = d.h + 'px'
    img.style.transform = `translate(${x.tx}px, ${x.ty}px) scale(${x.k})`
    img.style.opacity = d.op
  })
  const topImg = cur.draw[cur.draw.length - 1]
  const urlHTML = (topImg.url || sp.url || '').replace(/^([^/]+)/, '<b>$1</b>')
  if ($('url').innerHTML !== urlHTML) $('url').innerHTML = urlHTML
  const X = camXform(cur.cam, topImg.h)

  // spotlight + optional tag
  const spot = $('spot'), tag = $('tag')
  let best = null, bop = 0
  for (const h of sp.hl || []) {
    const op = Math.min(eo(clamp((u - h.a) / .3)), eo(clamp((h.b - u) / .3)))
    if (op > bop) { bop = op; best = h }
  }
  if (best && bop > 0) {
    const pad = 6
    spot.style.display = 'block'
    spot.style.left = (best.x * X.k + X.tx - pad) + 'px'
    spot.style.top = (best.y * X.k + X.ty - pad) + 'px'
    spot.style.width = (best.w * X.k + pad * 2) + 'px'
    spot.style.height = (best.h * X.k + pad * 2) + 'px'
    spot.style.opacity = bop
    spot.style.transform = `scale(${.96 + .04 * bop})`
    if (best.tag) {
      tag.style.display = 'block'
      tag.textContent = best.tag
      let tx = best.x * X.k + X.tx - pad, ty = best.y * X.k + X.ty - pad - 38
      if (best.tagPos === 'right') { tx = (best.x + best.w) * X.k + X.tx + pad + 14; ty = (best.y + best.h / 2) * X.k + X.ty - 15 }
      else if (best.tagPos === 'below' || ty < 8) ty = (best.y + best.h) * X.k + X.ty + pad + 10
      tag.style.left = (best.tagPos === 'right' ? tx : clamp(tx, 8, VP_W - 260)) + 'px'; tag.style.top = ty + 'px'
      tag.style.opacity = bop
      tag.style.transform = `translateY(${(1 - bop) * 8}px)`
    } else tag.style.display = 'none'
  } else { spot.style.display = 'none'; tag.style.display = 'none' }

  // cursor + click ripple
  const cursor = $('cursor'), ripple = $('ripple')
  const cp = keyed(sp.cur, u, ['x', 'y'])
  if (cp) {
    const first = sp.cur[0].at
    const vis = Math.min(eo(clamp((u - Math.max(first, -e.lead)) / .3 + (prevScreen && e.prev.spec.cur ? 1 : 0))), eo(clamp((e.dur - lt) / .3 + (nextScreen && e.next.spec.cur ? 1 : 0))))
    let press = 0
    for (const c of sp.click || []) { const d = u - c; if (d > -.12 && d < .25) press = Math.max(press, 1 - Math.abs((d - .02) / .14)) }
    const sx = cp.x * X.k + X.tx, sy = cp.y * X.k + X.ty
    cursor.style.display = 'block'
    cursor.style.opacity = vis
    cursor.style.transform = `translate(${sx - 3}px, ${sy - 2}px) scale(${1 - .18 * clamp(press)})`
    let rip = null
    for (const c of sp.click || []) { const d = u - c; if (d >= 0 && d < .6) rip = d / .6 }
    if (rip !== null) {
      const r = 10 + 34 * eo(rip)
      ripple.style.display = 'block'
      ripple.style.left = (sx - r) + 'px'; ripple.style.top = (sy - r) + 'px'
      ripple.style.width = ripple.style.height = (2 * r) + 'px'
      ripple.style.opacity = (1 - rip) * .95
    } else ripple.style.display = 'none'
  } else { cursor.style.display = 'none'; ripple.style.display = 'none' }

  // text column
  buildOnce(e, 'text', () => {
    $('kick').textContent = sp.kicker || ''
    $('headline').innerHTML = wordsHTML(sp.head)
    $('subs').innerHTML = (sp.subs || []).map(([t]) => `<div class="sub">${t}</div>`).join('')
  })
  const sameKick = prevScreen && e.prev.spec.kicker === sp.kicker
  const kp = sameKick ? 1 : eo(clamp((lt - .15) / .5))
  animWords($('headline'), lt, .12)
  const hout = eo(clamp((e.dur - lt) / .35))
  const hv = nextScreen ? hout : 1
  $('headline').style.opacity = hv
  $('headline').style.transform = `translateY(${(1 - hv) * -18}px)`
  $('subs').style.opacity = hv
  $('kick').style.opacity = kp * (nextScreen && e.next.spec.kicker !== sp.kicker ? hout : 1)
  $('kick').style.transform = `translateX(${(1 - kp) * -24}px)`
  $('subs').style.top = (372 + $('headline').offsetHeight + 34) + 'px'
  $('subs').querySelectorAll('.sub').forEach((el, i) => {
    const at = Math.max(sp.subs[i][1], .25 + i * .15)
    const p = eo(clamp((u - at + .1) / .45))
    el.style.opacity = p
    el.style.transform = `translateX(${(1 - p) * -22}px)`
  })

  // chapter progress bar
  const chs = TL.filter(x => x.chapter === e.chapter && x.type === 'screen')
  const cs = chs[0].start, ce = chs[chs.length - 1].start + chs[chs.length - 1].dur
  const gp = clamp((e.start + lt - cs) / (ce - cs))
  document.querySelectorAll('.chap').forEach((c, i) => {
    c.classList.toggle('on', i === e.chapter)
    c.querySelector('i').style.width = (i < e.chapter ? 100 : i === e.chapter ? gp * 100 : 0) + '%'
  })
  $('chapters').style.display = e.chapter === undefined ? 'none' : 'flex'
}

function renderTitle(e, lt) {
  const sp = e.spec, u = lt - e.lead, L = layers.title
  L.style.opacity = Math.min(eo(clamp(lt / .6)), eo(clamp((e.dur - lt) / .6)))
  buildOnce(e, 'title', () => {
    $('t-kick').textContent = sp.kicker || ''
    $('t-head').innerHTML = wordsHTML(sp.head)
    $('t-chips').innerHTML = (sp.chips || []).map(c => `<div class="chip"><span class="n">${c.n}</span>${c.label}</div>`).join('')
  })
  const kp = eo(clamp((lt - .2) / .6))
  $('t-kick').style.opacity = kp; $('t-kick').style.transform = `translateX(${(1 - kp) * -30}px)`
  animWords($('t-head'), lt, .35, .09)
  $('t-line').style.width = (eoq(clamp((lt - 1.1) / .9)) * 260) + 'px'
  $('t-chips').querySelectorAll('.chip').forEach((c, i) => {
    const p = clamp((u - sp.chips[i].at + .15) / .5)
    c.style.opacity = eo(p)
    c.style.transform = `translateY(${(1 - eback(p)) * 26}px)`
  })
  L.style.transform = `scale(${1 + (1 - eo(clamp((e.dur - lt) / .6))) * .03})`
}

// Custom diagram scene: spec.html is injected; any element with data-at reveals at that word.
// data-anim: up (default) | left | right | pop | fade | draw (scaleX line) | fill (accent background) | strike (width grows)
function renderCustom(e, lt) {
  const sp = e.spec, u = lt - e.lead, L = layers.custom
  L.style.opacity = Math.min(eo(clamp(lt / .5)), eo(clamp((e.dur - lt) / .6)))
  buildOnce(e, 'custom', () => { L.innerHTML = sp.html })
  L.querySelectorAll('[data-at]').forEach(el => {
    const at = parseAt(e.w, el.dataset.at), anim = el.dataset.anim || 'up'
    const p = clamp((u - at + .1) / (+(el.dataset.dur || .5)))
    if (anim === 'draw') { el.style.transform = `scaleX(${eoq(p)})`; return }
    if (anim === 'strike') { el.style.width = `calc(${eoq(p) * 100}% + ${eoq(p) * 16}px)`; return }
    if (anim === 'fill') { el.style.background = `rgba(var(--accent-rgb), ${eo(p)})`; el.style.color = p > .5 ? '#04140c' : ''; return }
    el.style.opacity = eo(p)
    const d = +(el.dataset.dist || 24)
    el.style.transform = anim === 'left' ? `translateX(${(1 - eo(p)) * -d}px)`
      : anim === 'right' ? `translateX(${(1 - eo(p)) * d}px)`
      : anim === 'pop' ? `scale(${.9 + .1 * eback(p)})`
      : anim === 'fade' ? 'none'
      : `translateY(${(1 - eback(p)) * d}px)`
  })
}

function renderChapter(e, lt) {
  const sp = e.spec, L = layers.chapter
  L.style.opacity = Math.min(eo(clamp(lt / .35)), eo(clamp((e.dur - lt) / .45)))
  buildOnce(e, 'chapter', () => { $('c-num').textContent = sp.num; $('c-title').innerHTML = wordsHTML(sp.title) })
  const np = eoq(clamp(lt / .8))
  $('c-num').style.transform = `translateY(${(1 - np) * 80}px)`; $('c-num').style.opacity = np
  $('c-kick').style.opacity = eo(clamp((lt - .15) / .5))
  animWords($('c-title'), lt, .2, .07)
  $('c-line').style.width = (eoq(clamp((lt - .35) / .9)) * 420) + 'px'
  L.style.transform = `translateX(${(1 - eo(clamp((e.dur - lt) / .45))) * -40}px)`
}

function renderOutro(e, lt) {
  const sp = e.spec, u = lt - e.lead, L = layers.outro
  L.style.opacity = eo(clamp(lt / .5))
  buildOnce(e, 'outro', () => {
    $('o-head').innerHTML = wordsHTML(sp.head)
    $('o-cols').innerHTML = (sp.cols || []).map(c => `<div class="ocol"><div class="n">${c.n}</div><div class="t">${c.t}</div><div class="d">${c.d}</div></div>`).join('')
  })
  const spans = $('o-head').querySelectorAll('.w > span')
  spans.forEach((s, i) => {
    const at = (sp.headAt || [])[i] ?? i * .12
    const p = eoq(clamp((u - at + .1) / .55))
    s.style.transform = `translateY(${(1 - p) * 105}%)`; s.style.opacity = p
    s.style.color = i === spans.length - 1 ? 'var(--accent)' : ''
  })
  $('o-cols').querySelectorAll('.ocol').forEach((c, i) => {
    const p = clamp((u - sp.cols[i].at - .05) / .55)
    c.style.opacity = eo(p); c.style.transform = `translateY(${(1 - eback(p)) * 34}px)`
  })
  $('fade').style.opacity = eio(clamp((lt - (e.dur - 1.1)) / 1.0))
}

function renderBg(t) {
  $('glow1').style.transform = `translate(${-200 + 260 * Math.sin(t * .11)}px, ${-520 + 140 * Math.cos(t * .09)}px)`
  $('glow2').style.transform = `translate(${1150 + 180 * Math.cos(t * .07)}px, ${420 + 120 * Math.sin(t * .1)}px)`
  $('grid').style.backgroundPosition = `${(t * 6) % 32}px ${(t * 3) % 32}px`
}

window.render = function (t) {
  renderBg(t)
  const e = TL.find(x => t >= x.start && t < x.start + x.dur) || TL[TL.length - 1]
  const lt = t - e.start
  for (const k in layers) if (k !== e.type) layers[k].style.opacity = 0
  if (e.type === 'screen') renderScreen(e, lt)
  else if (e.type === 'title') renderTitle(e, lt)
  else if (e.type === 'custom') renderCustom(e, lt)
  else if (e.type === 'chapter') renderChapter(e, lt)
  else renderOutro(e, lt)
  if (e.type !== 'outro') $('fade').style.opacity = 0
  return e.id
}

window.ready = async function () {
  await document.fonts.ready
  const srcs = [...new Set(TL.flatMap(e => e.spec.imgs ? e.spec.imgs.map(i => i.src) : []))]
  await Promise.all(srcs.map(s => new Promise((res) => { const im = new Image(); im.onload = res; im.onerror = () => { window.__errors.push('missing image shots/' + s + '.png'); res() }; im.src = `shots/${s}.png` })))
  return { total: TOTAL, errors: window.__errors, timeline: window.TIMELINE }
}
render(0)
