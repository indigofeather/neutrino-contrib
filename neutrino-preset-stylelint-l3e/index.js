const stylelint = require('@neutrinojs/stylelint')
const merge = require('deepmerge')

module.exports = (neutrino, opts = {}) => {
  neutrino.use(
    stylelint,
    merge.all([
      {
        config: {
          extends: require.resolve('stylelint-config-l3e')
        }
      },
      opts
    ])
  )
}
