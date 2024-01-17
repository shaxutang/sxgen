import ejs from 'ejs'
import fm from 'front-matter'
import { getHelpers } from './helper'

export type AddFrontMatter = {
  type: 'add'
  path: string
}

export type AppendFrontMappter = {
  type: 'append'
  path: string
  pattern: string
}

export type FrontMatter = AddFrontMatter | AppendFrontMappter

export type ParseTemplateResult = {
  frontMatter: FrontMatter
  body: string
}

/**
 * The helpers.
 */
const helpers = getHelpers()

/**
 * Renders an EJS template.
 *
 * @template T Type of the template arguments
 * @param {string} [content] - The content of the EJS template
 * @param {T} [args] - Optional arguments to pass into the template
 * @returns {string} The rendered string
 */
export function renderEjsTemplate<T extends Record<string, any>>(
  content: string,
  args: T = {} as T
): string {
  return ejs.render(content, {
    ...helpers,
    ...args
  })
}

/**
 * Parses a template.
 * @param {string} [content] - The content of the template.
 * @returns {ParseTemplateResult} An object containing the parsed front matter and body.
 */
export function parseTemplate(content: string): ParseTemplateResult {
  const { attributes: frontMatter, body } = fm<FrontMatter>(content)
  return {
    frontMatter,
    body
  }
}
