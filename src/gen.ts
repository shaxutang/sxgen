import chalk from 'chalk'
import { readFileSync, statSync } from 'fs'
import { mkdir, readFile, readdir, writeFile } from 'fs/promises'
import yml from 'js-yaml'
import { join } from 'path'
import prompts from 'prompts'
import { TRUNCATED, WORKSPACE_PATH } from './constants'
import { parseTemplate, renderEjsTemplate } from './parse'
import { isExists } from './util'

export interface GenOptions {
  name: string
}

const p = (questions: prompts.PromptObject | prompts.PromptObject[]) =>
  prompts(questions, {
    onCancel() {
      process.exit(1)
    }
  })

const isPrompts = (fileName: string) => /prompts\.(yaml|yml)/.test(fileName)

export async function loadWorkspace(): Promise<
  {
    title: string
    value: string
  }[]
> {
  return (await readdir(WORKSPACE_PATH, 'utf-8'))
    .filter((dir) => statSync(join(WORKSPACE_PATH, dir)).isDirectory())
    .map((dir) => {
      return {
        title: dir,
        value: join(WORKSPACE_PATH, dir)
      }
    })
}

export async function getFileContents(path: string) {
  return (await readdir(path, 'utf-8'))
    .filter((file) => statSync(join(path, file)).isFile())
    .map((file) => ({
      [file]: readFileSync(join(path, file), 'utf-8')
    }))
    .reduce((pre, cur) => ({ ...pre, ...cur }), {}) as Record<
    `${string}.ejs` | 'prompts.yaml' | 'prompts.yml',
    string
  >
}

export async function getPromptsVariables(promptsContent: string | undefined) {
  if (!promptsContent) return {}

  const promptsValue = yml.load(promptsContent) as Record<
    string,
    Omit<prompts.PromptObject, 'name'>
  >

  const questions = Object.entries(promptsValue).map(([name, value]) => {
    return {
      ...value,
      name
    } as prompts.PromptObject
  })

  return await p(questions)
}

export default async function (options: Partial<GenOptions> = {}) {
  const path =
    options?.name && (await isExists(join(WORKSPACE_PATH, options.name)))
      ? join(WORKSPACE_PATH, options.name)
      : (
          await p({
            type: 'select',
            name: 'name',
            choices: await loadWorkspace(),
            message: 'Please select a template.',
            validate: (value: string) => {
              if (!value) {
                return 'Please select a template.'
              }
              return true
            }
          })
        ).name

  const fileContents = await getFileContents(path)

  const promptsContent =
    fileContents['prompts.yaml'] || fileContents['prompts.yml']
  const variables = await getPromptsVariables(promptsContent)

  const process = Object.keys(fileContents)
    .filter((name) => !isPrompts(name))
    .map((name) => {
      const renderContents = renderEjsTemplate(
        fileContents[name as keyof typeof fileContents],
        variables
      ).split(TRUNCATED)
      return renderContents.map((content) => parseTemplate(content.trim()))
    })
    .flatMap((arr) => arr)

  for (const { frontMatter, body } of process) {
    // check parent path exists
    const path = frontMatter.path
    const parentDirPath = frontMatter.path.substring(0, path.lastIndexOf('/'))

    if (!(await isExists(parentDirPath))) {
      await mkdir(parentDirPath, {
        recursive: true
      })
    }

    if (!frontMatter.type || frontMatter.type === 'add') {
      if (await isExists(path)) {
        const { isOvewrite } = await p({
          type: 'confirm',
          name: 'isOvewrite',
          initial: false,
          message: chalk.red(
            `File \`${path}\` already exists, do you want to overwrite it?`
          )
        })
        if (!isOvewrite) return
      }
      writeFile(path, body)
      console.log(chalk.green(`Added: ${path}`))
    }

    if (frontMatter.type === 'append') {
      const { pattern } = frontMatter
      const dynamicPattern = new RegExp(pattern)

      if (!pattern) {
        console.warn(
          chalk.yellow(
            `SGEN don't append, Did you forget to define the "partten" attribute?`
          )
        )
        return
      }

      if (!(await isExists(path))) {
        await writeFile(path, [pattern, `${body}`].join('\n'), 'utf-8')
        return
      }

      const raw = await readFile(path, 'utf-8')

      const match = raw.match(dynamicPattern)

      if (match) {
        const endPoint = match.index! + pattern.length
        const before = raw.substring(0, endPoint)
        const after = raw.substring(endPoint)
        await writeFile(path, [before, `\n${body}`, after].join(''), 'utf-8')
        console.log(chalk.green(`Appended: ${path}`))
      } else {
        // If the pattern does not exist, display a warning message.
        console.warn(
          chalk.yellow(
            `Please add the following code to the "${path}":\n\n${pattern}`
          )
        )
      }
    }
  }
}
