// Playwright capture helpers: 1440px-wide viewport at 2× so zooms stay crisp.
// Env: PLAYWRIGHT_MODULE (path to playwright/index.mjs), SHOTS_DIR (default ./shots), TZ_ID (browser timezone).
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs'
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright')
export const OUT = process.env.SHOTS_DIR || new URL('./shots', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const metaFile = `${OUT}/meta.json`
const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, 'utf8')) : {}

export async function open({ login } = {}) {
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, timezoneId: process.env.TZ_ID || 'UTC' })
  if (login) await login(context)
  const page = await context.newPage()
  page.on('pageerror', e => console.log('pageerror', e.message.slice(0, 200)))
  return { browser, context, page }
}

// Saves shots/<name>.png and records target boxes (CSS px, page coordinates) in meta.json.
// full: resizes the viewport to the page height first, so sticky/100vh layouts render correctly.
export async function shot(page, name, { targets = {}, full = false } = {}) {
  await page.waitForTimeout(400)
  if (full) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight)
    await page.setViewportSize({ width: 1440, height: Math.max(900, h) })
    await page.waitForTimeout(300)
  }
  const boxes = {}
  for (const [k, loc] of Object.entries(targets)) {
    const b = await loc.boundingBox({ timeout: 2000 }).catch(() => null)
    const sy = await page.evaluate(() => window.scrollY)
    if (b) boxes[k] = { x: Math.round(b.x), y: Math.round(b.y + sy), w: Math.round(b.width), h: Math.round(b.height) }
  }
  await page.screenshot({ path: `${OUT}/${name}.png` })
  const size = await page.evaluate(() => ({ w: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight }))
  if (full) await page.setViewportSize({ width: 1440, height: 900 })
  meta[name] = { full, boxes, h: size.h }
  writeFileSync(metaFile, JSON.stringify(meta, null, 1))
  console.log('shot', name, 'h', size.h, JSON.stringify(boxes))
}
