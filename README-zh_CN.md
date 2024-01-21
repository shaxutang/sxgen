# SXGEN

![](https://img.shields.io/npm/v/sxgen?style=flat&colorA=002438&colorB=28CF8D)

[English](https://github.com/shaxutang/sxgen?tab=readme-ov-file#sxgen) | [简体中文](https://github.com/shaxutang/sxgen/blob/main/README-zh_CN.md)

一个用来生成代码的小工具。

## 安装

```bash
# 全局安装
npm install -g sxgen
```

## 如何使用

直接在终端执行`sxgen`

```bash
$ sxgen
? Please select a template. » - Use arrow-keys. Return to submit.
>   tsup
    tsup-react-design
    vite
    vite-vue-design
```

我提供了几个我常用的项目模板，可以任选一个进行创建。

当然，你肯定想要自定义属于你的代码片段，那么你可以在项目根路径创建一个`.sxgen`目录。

在其下新建目录并编写模板文件，目录结构如下：

```txt
|-- .sxgen/
|   |-- template/
|   |   |-- index.ejs
|   |   |-- other.ejs
```

## 编写格式

```ejs
---
path: src/index.ts
---
export function print() {
  console.log("hello world");
}
```

当你执行`sxgen`命令并选择该模板后，将会创建`src/index.ts`文件并生成对应代码。

## 定义变量

在实际使用中我们不可能都是固定内容，有的内容需要动态生成，比如项目名称，组件名称等等。

我们可以在模板目录下创建一个`prompts.yaml`文件，用于定义变量，其中定义的内容，会在执行命令时通过交互式的方式获取。

格式如下：

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

更多写法请参照：https://github.com/terkelg/prompts

接下来我们就可以在模板中进行使用

```ejs
---
path: <%= projectName %>/src/index.ts
---
export function print() {
  console.log("hello world");
}
```

## 内置工具“$s”

上面所描述的功能已经能够应对大多数情况，但是有些场景下，我们可能需要一些内置工具来帮助我们完成一些操作，比如，转换驼峰命名，获取当前日期或格式化日期等。

因此，SXGEN提供了内置工具“$s”，它提供了一组方法，这些方法可以被直接调用。

- changeCase：在camelCase、PascalCase、Capital Case、snake_case、kebab-case、CONSTANT_CASE 等之间转换字符串。https://github.com/blakeembrey/change-case
- dayjs：轻量级日期库。https://github.com/iamkun/dayjs

使用方式如下：

```ejs
---
path: <%= projectName %>/src/components/<%= name %>/index.tsx
---
/**
  createAt: <%= $s.dayjs().format('YYYY-MM-DD HH:mm:ss') %>
 */
<!-- 这里将会把组件名称转换为大驼峰 -->
export function <%= $s.changeCase.pascalCase(name) %>() {
  console.log("hello world");
}
```

## License

MIT
