# Neutrino middleware with case-sensitive-paths-webpack-plugin
[![NPM version][npm-image]][npm-url]

`neutrino-middleware-case-sensitive-paths` is a Neutrino middleware that
enforces module path case sensitivity.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v8

## Installation

#### Yarn

```bash
❯ yarn add --dev neutrino-middleware-case-sensitive-paths
```

#### npm

```bash
❯ npm install --save-dev neutrino-middleware-case-sensitive-paths
```

## Documentation

Install this middleware to your development dependencies, then set it in
`.neutrinorc.js`:

```js
  module.exports = {
    use: [
      'neutrino-middleware-case-sensitive-paths'
    ]
  }
```

[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-case-sensitive-paths.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-case-sensitive-paths
