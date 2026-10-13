// Loads a published page logged out and checks the video plays and seeks.
// Usage: PLAYWRIGHT_MODULE=<path to playwright/index.mjs> node verify.mjs <share_url> [screenshot.png]
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const [url, png = 'published.png'] = process.argv.slice(2)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
p.on('console', m => m.type() === 'error' && !/cdn-cgi\/rum|ERR_FAILED/.test(m.text()) && console.log('console:', m.text().slice(0, 200)))
await p.goto(url, { waitUntil: 'networkidle' })
const r = await p.evaluate(async () => {
  const v = document.querySelector('video')
  const out = { title: document.title, h1: document.querySelector('h1')?.textContent, copyButtons: document.querySelectorAll('.copy').length }
  if (!v) return out
  v.muted = true
  out.play = await v.play().then(() => 'ok', e => e.message)
  await new Promise(r => setTimeout(r, 2500))
  v.currentTime = Math.min(60, (v.duration || 120) / 2)
  await new Promise(r => setTimeout(r, 2000))
  return { ...out, duration: v.duration, seekedTo: v.currentTime, readyState: v.readyState, src: v.currentSrc }
})
console.log(JSON.stringify(r, null, 1))
await p.screenshot({ path: png })
await b.close()
