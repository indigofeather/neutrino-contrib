# Neutrino middleware with UglifyJS
[![NPM version][npm-image]][npm-url]

`neutrino-middleware-uglifyjs` is a Neutrino middleware that adds
[UglifyJS][UglifyJS] support.

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino 8

## Installation

#### Yarn

```bash
❯ yarn add --dev neutrino-middleware-uglifyjs
```

#### npm

```bash
❯ npm install --save-dev neutrino-middleware-uglifyjs
```

## Documentation

Install this middleware to your development dependencies, then set it in
`.neutrinorc.js`:

```js
  module.exports = {
    use: [
      'neutrino-middleware-uglifyjs'
    ]
  }
```

[UglifyJS]: https://github.com/webpack-contrib/uglifyjs-webpack-plugin
[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-uglifyjs.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-uglifyjs
