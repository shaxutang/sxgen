import { fileURLToPath } from 'url'
import { loopPath } from './util'

export const WORKSPACE_NAME = '.sxgen'
export const WORKSPACE_PATH = loopPath(process.cwd(), WORKSPACE_NAME)
export const PRESET_WORKSPACE_PATH = fileURLToPath(
  new URL(`../${WORKSPACE_NAME}`, import.meta.url)
)
export const TRUNCATED = '<!--truncate-->'
