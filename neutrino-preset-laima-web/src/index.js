const { join, resolve } = require('path')
const merge = require('deepmerge')
const git = require('git-rev-sync')
const ScriptExtHtmlPlugin = require('script-ext-html-webpack-plugin')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const { optimize } = require('webpack')
const htmlLoader = require('neutrino-middleware-html-loader')
const styleLoader = require('neutrino-middleware-style-loader')
const fontLoader = require('neutrino-middleware-font-loader')
const imageLoader = require('neutrino-middleware-image-loader')
const compileLoader = require('neutrino-middleware-compile-loader')
const env = require('neutrino-middleware-env')
const hot = require('neutrino-middleware-hot')
const htmlTemplate = require('neutrino-middleware-html-template')
const copy = require('neutrino-middleware-copy')
const clean = require('neutrino-middleware-clean')
const uglify = require('neutrino-middleware-uglifyjs')
const loaderMerge = require('neutrino-middleware-loader-merge')
const devServer = require('neutrino-middleware-dev-server')
const extractstyles = require('neutrino-preset-extractstyles')
const pwa = require('neutrino-middleware-pwa')
const compression = require('neutrino-middleware-compression')
const bundleanalyzer = require('neutrino-middleware-bundleanalyzer')
const optimizecss = require('neutrino-middleware-optimizecss')
const caseSensitivePaths = require('neutrino-middleware-case-sensitive-paths')
const browserSync = require('neutrino-middleware-browser-sync')

const MODULES = join(__dirname, 'node_modules')

module.exports = (neutrino, opts = {}) => {
  const options = merge(
    {
      env: [],
      hot: true,
      html: {
        title: 'Laima Web App',
        template: resolve(__dirname, 'template.ejs'),
        git: git.short(),
        rev: new Date().toISOString(),
        minify: {
          preserveLineBreaks: false
        }
      },
      devServer: {
        port: 3100,
        hot: opts.hot !== false
      },
      polyfills: {
        async: true
      },
      babel: {},
      cssModules: false,
      css: {
        localIdentName: '[name]__[local]--[hash:base64:5]'
      }
    },
    opts
  )

  Object.assign(options, {
    babel: compileLoader.merge(
      {
        plugins: [
          ...(options.polyfills.async ? [[require.resolve('fast-async'), { spec: true }]] : []),
          require.resolve('babel-plugin-syntax-dynamic-import'),
          require.resolve('babel-plugin-lodash')
        ],
        presets: [
          [
            require.resolve('babel-preset-env'),
            {
              debug: neutrino.options.debug,
              modules: false,
              useBuiltIns: true,
              exclude: options.polyfills.async ? ['transform-regenerator', 'transform-async-to-generator'] : [],
              targets: {
                browsers: []
              }
            }
          ]
        ]
      },
      options.babel
    )
  })
  options.css.modules = options.cssModules

  const staticDir = join(neutrino.options.source, 'static')
  const presetEnvOptions = options.babel.presets[0][1]

  if (!presetEnvOptions.targets.browsers.length) {
    presetEnvOptions.targets.browsers.push(
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Edge versions',
      'last 2 Opera versions',
      'last 2 Safari versions',
      'last 2 iOS versions'
    )
  }

  neutrino.use(env, options.env)
  neutrino.use(htmlLoader)
  neutrino.use(styleLoader, {
    css: options.css
  })
  neutrino.use(fontLoader)
  neutrino.use(imageLoader)
  neutrino.use(htmlTemplate, options.html)
  neutrino.use(compileLoader, {
    include: [neutrino.options.source, neutrino.options.tests],
    exclude: [staticDir],
    babel: options.babel
  })
  neutrino.use(bundleanalyzer)
  neutrino.use(optimizecss)
  neutrino.use(caseSensitivePaths)
  neutrino.use(copy, {
    patterns: [
      {
        context: staticDir,
        from: '**/*',
        to: '.',
        transform: (content, path) => {
          if (process.env.NODE_ENV !== 'production') {
            return content
          }

          if (path.match(/\.json$/)) {
            return JSON.stringify(JSON.parse(content))
          }

          return content
        }
      }
    ]
  })

  neutrino.config
    .target('web')
    .context(neutrino.options.root)
    .entry('index')
    .add(neutrino.options.entry)
    .end()
    .output.path(neutrino.options.output)
    .publicPath('./')
    .filename('[name].js')
    .chunkFilename('[name].js')
    .end()
    .resolve.modules.add('node_modules')
    .add(neutrino.options.node_modules)
    .add(MODULES)
    .end()
    .extensions.add('.js')
    .add('.json')
    .end()
    .end()
    .resolveLoader.modules.add(neutrino.options.node_modules)
    .add(MODULES)
    .end()
    .end()
    .node.set('Buffer', false)
    .set('fs', 'empty')
    .set('tls', 'empty')
    .end()
    .plugin('script-ext')
    .use(ScriptExtHtmlPlugin, [{ defaultAttribute: 'defer' }])
    .end()
    .plugin('lodash')
    .use(LodashModuleReplacementPlugin)
    .end()
    .module.rule('worker')
    .test(/\.worker\.js$/)
    .use('worker')
    .loader(require.resolve('worker-loader'))
    .end()
    .end()
    .end()
    .when(neutrino.config.module.rules.has('lint'), () =>
      neutrino.use(loaderMerge('lint', 'eslint'), {
        envs: ['browser', 'commonjs']
      })
    )
    .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-module-eval-source-map'))
    .when(neutrino.options.command === 'start', config => {
      config.when(options.hot, () => neutrino.use(hot))
      neutrino.use(devServer, options.devServer)
      neutrino.use(browserSync, {
        browserSyncOptions: {
          port: 4000,
          proxy: {
            target: 'http://localhost:3100/',
            ws: true
          },
          logPrefix: 'Laima',
          open: true
        },
        pluginOptions: {
          reload: false
        }
      })
    })
    .when(process.env.NODE_ENV === 'production', () => {
      neutrino.config
        .plugin('vendor-chunk')
        .use(optimize.CommonsChunkPlugin, [
          {
            name: 'vendor',
            minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
          }
        ])
        .end()
        .plugin('runtime-chunk')
        .use(optimize.CommonsChunkPlugin, [
          {
            name: 'manifest',
            minChunks: Infinity
          }
        ])
        .end()
        .plugin('module-concat')
        .use(optimize.ModuleConcatenationPlugin)
        .end()
      neutrino.use(uglify, {
        parallel: true
      })
      neutrino.use(pwa, {
        updateStrategy: 'changed',
        autoUpdate: true,
        ServiceWorker: {
          events: true,
          navigateFallbackURL: '/',
          minify: true
        }
      })
      neutrino.use(compression)
    })
    .when(neutrino.options.command === 'build', config => {
      neutrino.use(clean, { paths: [neutrino.options.output] })
      config.output.filename('[name]-[chunkhash:7].js')
    })
  neutrino.on('prebuild', () => {
    neutrino.use(extractstyles, {
      plugin: {
        filename: '[name]-[contenthash:7].css',
        allChunks: true
      }
    })
  })
}
