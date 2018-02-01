# Neutrino preset with ESLint l3e-base configuration
[![NPM version][npm-image]][npm-url]

`neutrino-preset-eslint-l3e-base` is a Neutrino preset that adds
[ESlint][eslint] support with pre-configured
[l3e ESLint configuration][eslint-config-l3e-base].

## Requirements

- Node.js v6 LTS, v8, v9
- Yarn v1.2.1+, or npm v5.4+
- Neutrino v8

## Installation

#### Yarn

```bash
❯ yarn add --dev neutrino-preset-eslint-l3e-base
```

#### npm

```bash
❯ npm install --save-dev neutrino-preset-eslint-l3e-base
```

## Documentation

Install this preset to your development dependencies, then set it in
`.neutrinorc.js`:

```js
  module.exports = {
    use: [
      'neutrino-preset-eslint-l3e-base'
    ]
  }
```

[eslint]: https://eslint.org/
[eslint-config-l3e-base]: https://github.com/l3e/eslint-config-l3e-base
[npm-image]: https://img.shields.io/npm/v/neutrino-preset-eslint-l3e-base.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-eslint-l3e-base
