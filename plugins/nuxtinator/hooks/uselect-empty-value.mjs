// PostToolUse hook: flags `value: ''` options added to a .vue file that renders USelect / USelectMenu.
// Reka UI's SelectItem throws on an empty-string value, and the error never names the option.
import { readFileSync } from 'node:fs'

const EMPTY_VALUE = /\bvalue\s*:\s*(''|""|``)/

let input
try {
  input = JSON.parse(readFileSync(0, 'utf8'))
} catch {
  process.exit(0)
}

const toolInput = input.tool_input ?? {}
const file = toolInput.file_path ?? ''
if (!file.endsWith('.vue')) process.exit(0)

const written = [toolInput.content, toolInput.new_string, ...(toolInput.edits ?? []).map(e => e.new_string)]
  .filter(Boolean)
  .join('\n')
if (!EMPTY_VALUE.test(written)) process.exit(0)

let source
try {
  source = readFileSync(file, 'utf8')
} catch {
  process.exit(0)
}
if (!/<USelect(Menu)?\b/.test(source)) process.exit(0)

const lines = source
  .split('\n')
  .map((text, i) => (EMPTY_VALUE.test(text) ? i + 1 : 0))
  .filter(Boolean)

process.stderr.write(
  `${file} renders USelect/USelectMenu and has an option with value '' (line ${lines.join(', ')}).\n` +
  `Reka UI's SelectItem throws on an empty-string value: the dropdown opens empty and the console shows ` +
  `"Unhandled error during execution of setup function" with no hint which option caused it.\n` +
  `Build :items from real options only, show the empty state with the placeholder prop (the model value may stay ''), ` +
  `and add an explicit clear (×) button if the user needs to unset it. If this value: '' is not a select option, ignore this.\n`
)
process.exit(2)
