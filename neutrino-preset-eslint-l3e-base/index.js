const lint = require('@neutrinojs/eslint')
const merge = require('deepmerge')

module.exports = (neutrino, opts = {}) => {
  neutrino.use(
    lint,
    merge.all([
      {
        eslint: {
          baseConfig: {
            extends: ['l3e-base']
          }
        }
      },
      opts
    ])
  )
}
