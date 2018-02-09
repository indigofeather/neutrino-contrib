const react = require('neutrino-preset-laima-react')
const compileLoader = require('@neutrinojs/compile-loader')
const merge = require('deepmerge')
const { join, resolve } = require('path')

const getTheme = () => {
  const cwd = process.cwd()
  const pkg = require(join(cwd, 'package.json'))

  if (pkg.theme && typeof pkg.theme === 'string') {
    let cfgPath = pkg.theme

    // relative path
    if (pkg.theme.charAt(0) === '.') {
      cfgPath = resolve(cwd, cfgPath)
    }

    return require(cfgPath)()
  }

  if (pkg.theme && typeof pkg.theme === 'object') {
    return pkg.theme
  }

  return {}
}

module.exports = (neutrino, opts = {}) => {
  const options = merge(
    {
      style: {
        test: neutrino.regexFromExtensions(['css', 'less']),
        loaders: [
          {
            loader: require.resolve('less-loader'),
            useId: 'less',
            options: {
              modifyVars: getTheme()
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
