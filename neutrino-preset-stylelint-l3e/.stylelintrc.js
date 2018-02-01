const { Neutrino } = require('neutrino')

module.exports = Neutrino({ cwd: __dirname })
  .use(require('.'))
  .call('stylelintrc')
