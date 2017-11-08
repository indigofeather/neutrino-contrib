# Neutrino preset with ESLint l3e configuration
[![NPM version][npm-image]][npm-url]

`neutrino-preset-eslint-l3e` is a Neutrino preset that adds
[ESlint][eslint] support with pre-configured
[l3e ESLint configuration][eslint-config-l3e].

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7, Neutrino build preset

## Installation

#### Yarn

```bash
❯ yarn add --dev neutrino-preset-eslint-l3e
```

#### npm

```bash
❯ npm install --save-dev neutrino-preset-eslint-l3e
```

## Documentation

Install this preset to your development dependencies, then set it in
`.neutrinorc.js`:

```js
  module.exports = {
    use: [
      'neutrino-preset-eslint-l3e'
    ]
  }
```

[eslint]: https://eslint.org/
[eslint-config-l3e]: https://github.com/l3e/eslint-config-l3e
[npm-image]: https://img.shields.io/npm/v/neutrino-preset-eslint-l3e.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-eslint-l3e
