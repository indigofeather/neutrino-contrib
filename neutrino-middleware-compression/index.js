const CompressionPlugin = require('compression-webpack-plugin')

module.exports = (neutrino, opts = {}) => {
  neutrino.config.plugin('compression').use(CompressionPlugin, [opts])
}
