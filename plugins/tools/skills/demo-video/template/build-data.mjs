// Writes data.js (audio timings and word timestamps) for the page, which loads over file://.
import { readFileSync, writeFileSync } from 'node:fs'
const timing = readFileSync('audio/timing.json', 'utf8'), words = readFileSync('audio/words.json', 'utf8')
writeFileSync('data.js', `window.TIMING = ${timing};\nwindow.WORDS = ${words};\n`)
