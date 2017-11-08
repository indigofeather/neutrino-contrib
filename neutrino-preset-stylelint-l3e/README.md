# Neutrino preset with Stylelint l3e configuration
[![NPM version][npm-image]][npm-url]

`neutrino-preset-stylelint-l3e` is a Neutrino preset that adds
[Stylelint][stylelint] support with pre-configured
[l3e Stylelint configuration][stylelint-config-l3e].

## Requirements

- Node.js v6.10+
- Yarn or npm client
- Neutrino v7, Neutrino build preset

## Installation

#### Yarn

```bash
❯ yarn add --dev neutrino-preset-stylelint-l3e
```

#### npm

```bash
❯ npm install --save-dev neutrino-preset-stylelint-l3e
```

## Documentation

Install this preset to your development dependencies, then set it in
`.neutrinorc.js`:

```js
  module.exports = {
    use: [
      'neutrino-preset-stylelint-l3e'
    ]
  }
```

[stylelint]: https://stylelint.io
[stylelint-config-l3e]: https://github.com/l3e/stylelint-config-l3e
[npm-image]: https://img.shields.io/npm/v/neutrino-preset-stylelint-l3e.svg
[npm-url]: https://npmjs.org/package/neutrino-preset-stylelint-l3e
