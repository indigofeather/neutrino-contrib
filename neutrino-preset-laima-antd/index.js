const react = require('neutrino-preset-laima-react')
const compileLoader = require('@neutrinojs/compile-loader')
const merge = require('deepmerge')

module.exports = (neutrino, opts = {}) => {
  const theme = opts.theme ? opts.theme() : {}

  const options = merge(
    {
      style: {
        test: neutrino.regexFromExtensions(['css', 'less']),
        loaders: [
          {
            loader: require.resolve('less-loader'),
            useId: 'less',
            options: {
              modifyVars: theme
            }
          }
        ]
      }
    },
    opts
  )

  Object.assign(options, {
    babel: compileLoader.merge(
      {
        plugins: [[require.resolve('babel-plugin-import'), [{ libraryName: 'antd', style: true }]]]
      },
      options.babel
    )
  })

  neutrino.use(react, options)
}
