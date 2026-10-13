// node render.mjs info | stills <out_dir> <t1> <t2> … | frames <seg.mp4> <f0> <f1>
// Playwright: set PLAYWRIGHT_MODULE to a playwright/index.mjs path, or `npm i playwright` next to this file.
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
const [mode, out, ...rest] = process.argv.slice(2)
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] })
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
page.on('pageerror', e => console.error('pageerror', e.message))
await page.goto('file://' + process.cwd() + '/index.html')
const info = await page.evaluate(() => window.ready())
if (info.errors.length) console.error('ERRORS', info.errors)
if (mode === 'info') { console.log(JSON.stringify(info.timeline)); console.log('total', info.total) }
if (mode === 'stills') {
  mkdirSync(out, { recursive: true })
  for (const t of rest) {
    const id = await page.evaluate(t => window.render(t), +t)
    await page.screenshot({ path: `${out}/t${(+t).toFixed(2).padStart(7, '0')}_${id}.png` })
  }
}
if (mode === 'frames') {
  const [f0, f1] = rest.map(Number)
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', '30', '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', '30', out], { stdio: ['pipe', 'inherit', 'inherit'] })
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.render(t), f / 30)
    const buf = await page.screenshot({ type: 'png' })
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r))
    if ((f - f0) % 150 === 0) console.log(out, f, '/', f1)
  }
  ff.stdin.end()
  await new Promise(r => ff.on('close', r))
}
await browser.close()
