const { join, resolve } = require('path')
const merge = require('deepmerge')
const git = require('git-rev-sync')
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const { optimize } = require('webpack')
const htmlLoader = require('@neutrinojs/html-loader')
const styleLoader = require('@neutrinojs/style-loader')
const fontLoader = require('@neutrinojs/font-loader')
const imageLoader = require('@neutrinojs/image-loader')
const compileLoader = require('@neutrinojs/compile-loader')
const env = require('@neutrinojs/env')
const hot = require('@neutrinojs/hot')
const htmlTemplate = require('@neutrinojs/html-template')
const copy = require('@neutrinojs/copy')
const clean = require('@neutrinojs/clean')
const minify = require('@neutrinojs/minify')
const loaderMerge = require('@neutrinojs/loader-merge')
const devServer = require('@neutrinojs/dev-server')
const pwa = require('@neutrinojs/pwa')
const compression = require('neutrino-middleware-compression')
const bundleanalyzer = require('neutrino-middleware-bundleanalyzer')
const caseSensitivePaths = require('neutrino-middleware-case-sensitive-paths')
const browserSync = require('neutrino-middleware-browser-sync')

const MODULES = join(__dirname, 'node_modules')

module.exports = (neutrino, opts = {}) => {
  const publicPath = './'
  const options = merge(
    {
      publicPath,
      env: [],
      hot: true,
      hotEntries: [],
      html: {
        title: 'Laima Web App',
        template: resolve(__dirname, 'template.ejs'),
        git: git.short(),
        rev: new Date().toISOString(),
        minify: {
          preserveLineBreaks: false
        }
      },
      polyfills: {
        async: true
      },
      devServer: {
        port: 3100,
        hot: opts.hot !== false,
        publicPath: resolve('/', publicPath)
      },
      style: {
        hot: opts.hot !== false,
        extract: (opts.style && opts.style.extract) || (process.env.NODE_ENV === 'production' && {}),
        css: {
          localIdentName: '[name]__[local]--[hash:base64:5]'
        }
      },
      clean: opts.clean !== false && {
        paths: [neutrino.options.output]
      },
      minify: {
        babel: {},
        style: {},
        image: false
      },
      babel: {},
      targets: {},
      font: {},
      image: {}
    },
    opts
  )

  if (typeof options.devServer.proxy === 'string') {
    options.devServer.proxy = {
      '**': {
        target: options.devServer.proxy,
        changeOrigin: true
      }
    }
  }

  if (!options.targets.node && !options.targets.browsers) {
    options.targets.browsers = [
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Edge versions',
      'last 2 Opera versions',
      'last 2 Safari versions',
      'last 2 iOS versions'
    ]
  }

  Object.assign(options, {
    minify: {
      babel: options.minify.babel === true ? {} : options.minify.babel,
      style: options.minify.style === true ? {} : options.minify.style,
      image: options.minify.image === true ? {} : options.minify.image
    },
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
              targets: options.targets
            }
          ]
        ]
      },
      options.babel
    )
  })

  const staticDir = join(neutrino.options.source, 'static')

  neutrino.use(env, options.env)
  neutrino.use(htmlLoader)
  neutrino.use(htmlTemplate, options.html)
  neutrino.use(compileLoader, {
    include: [neutrino.options.source, neutrino.options.tests],
    exclude: [staticDir],
    babel: options.babel
  })
  neutrino.use(bundleanalyzer)
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

  Object.keys(neutrino.options.mains).forEach(key => {
    neutrino.config.entry(key).add(neutrino.options.mains[key])
    neutrino.use(
      htmlTemplate,
      merge(
        {
          pluginId: `html-${key}`,
          filename: `${key}.html`
        },
        options.html
      )
    )
  })

  neutrino.config
    .when(options.style, () => neutrino.use(styleLoader, options.style))
    .when(options.font, () => neutrino.use(fontLoader, options.font))
    .when(options.image, () => neutrino.use(imageLoader, options.image))
    .target('web')
    .context(neutrino.options.root)
    .output.path(neutrino.options.output)
    .publicPath(options.publicPath)
    .filename('[name].js')
    .chunkFilename('[name].[chunkhash].js')
    .end()
    .resolve.modules.add('node_modules')
    .add(neutrino.options.node_modules)
    .add(MODULES)
    .end()
    .extensions.merge(neutrino.options.extensions.concat('json').map(ext => `.${ext}`))
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
    .plugin('lodash')
    .use(LodashModuleReplacementPlugin)
    .end()
    .module.rule('worker')
    .test(neutrino.regexFromExtensions(neutrino.options.extensions.map(ext => `worker.${ext}`)))
    .use('worker')
    .loader(require.resolve('worker-loader'))
    .end()
    .end()
    .end()
    .when(neutrino.config.module.rules.has('lint'), () => {
      neutrino.use(loaderMerge('lint', 'eslint'), { envs: ['browser', 'commonjs'] })
    })
    .when(process.env.NODE_ENV === 'development', config => config.devtool('cheap-module-eval-source-map'))
    .when(neutrino.options.command === 'start', config => {
      config.when(options.hot, () => {
        neutrino.use(hot)
        config.when(options.hotEntries, c => {
          Object.keys(neutrino.options.mains).forEach(key => {
            c.entry(key).batch(entry => {
              options.hotEntries.forEach(hotEntry => entry.prepend(hotEntry))
              entry
                .prepend(require.resolve('webpack/hot/dev-server'))
                .prepend(`${require.resolve('webpack-dev-server/client')}?/`)
            })
          })
        })
      })
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
    .when(process.env.NODE_ENV === 'production', config => {
      config
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
            name: 'runtime',
            minChunks: Infinity
          }
        ])
        .end()
        .when(options.minify, () => neutrino.use(minify, options.minify))
        .plugin('module-concat')
        .use(optimize.ModuleConcatenationPlugin)
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
      config.when(options.clean, () => neutrino.use(clean, options.clean))
      config.output.filename('[name].[chunkhash].js')
    })
}
