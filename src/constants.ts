import { fileURLToPath } from 'url'
import { loopPath } from './util'

export const WORKSPACE_NAME = '.sgen'
export const WORKSPACE_PATH =
  loopPath(process.cwd(), WORKSPACE_NAME) ||
  fileURLToPath(new URL(`../${WORKSPACE_NAME}`, import.meta.url))
export const TRUNCATED = '<!--truncate-->'
