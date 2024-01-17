import { accessSync } from 'fs'
import { access } from 'fs/promises'
import { join } from 'path'

export async function isExists(path: string, mode?: number) {
  return access(path, mode)
    .then(() => true)
    .catch(() => false)
}

export function isExistsSync(path: string, mode?: number) {
  try {
    accessSync(path, mode)
    return true
  } catch {
    return false
  }
}

export function loopPath(path: string, find: string) {
  if (isExistsSync(join(path, find))) {
    return join(path, find)
  } else {
    const parentPath = join(path, '..')
    if (parentPath === path) {
      return ''
    }
    return loopPath(parentPath, find)
  }
}
