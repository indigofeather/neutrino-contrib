const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = (neutrino, opts = {}) => {
  const { browserSyncOptions, pluginOptions } = opts

  neutrino.config.plugin('browser-sync').use(BrowserSyncPlugin, [browserSyncOptions, pluginOptions])
}
