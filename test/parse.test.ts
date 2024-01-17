import { readFile } from 'fs/promises'
import { expect, test } from 'vitest'
import { parseTemplate, renderEjsTemplate } from '../src/core/parse'

const content = await readFile(
  new URL('./fixtures/demo.ejs', import.meta.url),
  'utf-8'
)

test('parse template', async () => {
  expect(parseTemplate(content)).toMatchInlineSnapshot(`
    {
      "body": "export function lib() {
      console.log('this is a lib.')
    }",
      "frontMatter": {
        "path": "src/lib/<%= name %>/index.ts",
      },
    }
  `)
})

test('render ejs template', async () => {
  expect(
    renderEjsTemplate<{ name: string }>(content, {
      name: 'parse'
    })
  ).toMatchInlineSnapshot(`
    "---
    path: src/lib/parse/index.ts
    ---

    export function lib() {
      console.log('this is a lib.')
    }"
  `)
})
