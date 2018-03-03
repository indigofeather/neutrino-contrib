const react = require('neutrino-preset-laima-react')
const compileLoader = require('@neutrinojs/compile-loader')
const styles = require('@neutrinojs/style-loader')
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
  neutrino.use(styles, {
    loaders: [
      {
        loader: require.resolve('less-loader'),
        useId: 'less',
        options: {
          modifyVars: getTheme()
        }
      }
    ],
    test: /\.less$/,
    ruleId: 'less-style',
    hot: opts.hot !== false,
    extract: (opts.style && opts.style.extract) || (process.env.NODE_ENV === 'production' && {}),
    css: {
      localIdentName: '[name]__[local]--[hash:base64:5]'
    },
    modulesTest: /modules.less$/
  })

  Object.assign(opts, {
    babel: compileLoader.merge(
      {
        plugins: [[require.resolve('babel-plugin-import'), [{ libraryName: 'antd', style: true }]]]
      },
      opts.babel
    )
  })

  neutrino.use(react, opts)
}
