# Neutrino middleware with compression-webpack-plugin
[![NPM version][npm-image]][npm-url]

`neutrino-middleware-compression` is a Neutrino middleware that adds
[compression][compression] support.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7

## Installation

#### Yarn

```bash
❯ yarn add --dev neutrino-middleware-compression
```

#### npm

```bash
❯ npm install --save-dev neutrino-middleware-compression
```

## Documentation

Install this middleware to your development dependencies, then set it in
`.neutrinorc.js`:

```js
  module.exports = {
    use: [
      'neutrino-middleware-compression'
    ]
  }
```

[compression]: https://github.com/webpack-contrib/compression-webpack-plugin
[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-compression.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-compression
