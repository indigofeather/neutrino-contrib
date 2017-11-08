# Neutrino middleware with BrowserSync
[![NPM version][npm-image]][npm-url]

`neutrino-middleware-browser-sync` is a Neutrino middleware that adds
[BrowserSync][BrowserSync] support.

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7

## Installation

#### Yarn

```bash
❯ yarn add --dev neutrino-middleware-browser-sync
```

#### npm

```bash
❯ npm install --save-dev neutrino-middleware-browser-sync
```

## Documentation

Install this middleware to your development dependencies, then set it in
`.neutrinorc.js`:

```js
  module.exports = {
    use: [
      'neutrino-middleware-browser-sync', {
        browserSyncOptions: {
          port: 4000
        },
        pluginOptions: {
          reload: false
        }
      }
    ]
  }
```

[BrowserSync]: https://browsersync.io/
[npm-image]: https://img.shields.io/npm/v/neutrino-middleware-browser-sync.svg
[npm-url]: https://npmjs.org/package/neutrino-middleware-browser-sync
