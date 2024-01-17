import { program } from 'commander'
import { version } from '../package.json'
import gen from './gen'

program.name('sgen').version(version)

program.argument('[name]', 'template name').action((name) => {
  gen({ name })
})

program.parse()
