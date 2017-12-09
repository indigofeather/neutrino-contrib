const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

module.exports = (neutrino, opts = {}) => {
  neutrino.config.plugin('case-sensitive-paths').use(CaseSensitivePathsPlugin, [opts])
}
