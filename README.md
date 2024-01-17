# SXGEN

[English](https://github.com/shaxutang/sxgen?tab=readme-ov-file#sxgen) | [简体中文](https://github.com/shaxutang/sxgen/blob/main/README-zh_CN.md)

A simple cli tool to generate code.

## Install

```bash
# Global installation
npm install -g sxgen
```

## How to use

Execute `sxgen` directly in the terminal

```bash
$ sxgen
? Please select a template. » - Use arrow-keys. Return to submit.
>tsup
     tsup-react-design
     vite
     vite-vue-design
```

I have provided several project templates that I commonly use, and you can choose any one to create.

Of course, you definitely want to customize your own code snippets, so you can create a `.sxgen` directory in the project root path.

Create a new directory under it and write the template file. The directory structure is as follows:

```txt
|-- .sxgen/
| |-- template/
| | |-- index.ejs
| | |-- other.ejs
```

## Writing format

```ejs
---
path: src/index.ts
---
export function print() {
   console.log("hello world");
}
```

When you execute the `sxgen` command and select the template, the `src/index.ts` file will be created and the corresponding code will be generated.

## Define variables

In actual use, we cannot all have fixed content. Some content needs to be dynamically generated, such as project name, component name, etc.

We can create a `prompts.yaml` file in the template directory to define variables. The content defined in it will be obtained interactively when executing the command.

The format is as follows:

```yaml
projectName:
   type: text
   message: 'What is the name of your project?'
username:
   type: text
   message: 'What is your username?'
email:
   type: text
   message: 'What is your email address?'
color:
   type: 'select',
   message: 'Pick colors',
   choices: [
     { title: 'Red', value: '#ff0000' },
     { title: 'Green', value: '#00ff00' },
     { title: 'Blue', value: '#0000ff' }
   ],
```

For more writing methods, please refer to: https://github.com/terkelg/prompts

Next we can use it in the template

```ejs
---
path: <%= projectName %>/src/index.ts
---
export function print() {
   console.log("hello world");
}
```

## Built-in tool "$s"

The functions described above can handle most situations, but in some scenarios, we may need some built-in tools to help us complete some operations, such as converting camel case naming, getting the current date or formatting the date, etc.

Therefore, SXGEN provides a built-in tool "$s", which provides a set of methods that can be called directly.

- changeCase: Convert strings between camelCase, PascalCase, Capital Case, snake_case, kebab-case, CONSTANT_CASE, etc. https://github.com/blakeembrey/change-case
- dayjs: lightweight date library. https://github.com/iamkun/dayjs

How to use it:

```ejs
---
path: <%= projectName %>/src/components/<%= name %>/index.tsx
---
/**
   createAt: <%= $s.dayjs().format('YYYY-MM-DD HH:mm:ss') %>
  */
<!-- This will convert the component name into camel case -->
export function <%= $s.changeCase.pascalCase(name) %>() {
   console.log("hello world");
}
```

## License

MIT
​
