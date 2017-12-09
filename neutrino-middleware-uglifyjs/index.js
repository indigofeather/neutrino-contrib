const UglifyjsPlugin = require('uglifyjs-webpack-plugin')

module.exports = (neutrino, opts = {}) => {
  neutrino.config.plugin('minify').use(UglifyjsPlugin, [opts])
}
