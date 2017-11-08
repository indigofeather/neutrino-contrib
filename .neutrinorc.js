module.exports = {
  use: [
    [
      './neutrino-preset-eslint-l3e-base',
      {
        include: ['.*.js', '*/.*.js', '*/*.js', '*/src/**/*.js']
      }
    ]
  ]
}
