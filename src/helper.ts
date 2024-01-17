import * as changeCase from 'change-case'
import dayjs from 'dayjs'

export const defaultHelpers = {
  $s: {
    changeCase,
    dayjs
  }
}

export function getHelpers() {
  return {
    ...defaultHelpers
  }
}
