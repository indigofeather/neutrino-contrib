import test from 'ava'
import { validate } from 'webpack'
import { Neutrino } from 'neutrino'

const preset = require('../src/index')

test('loads preset', t => {
  t.notThrows(() => preset)
})

test('uses preset', t => {
  t.notThrows(() => Neutrino().use(preset))
})

test('valid preset production', t => {
  const api = Neutrino({ env: { NODE_ENV: 'production' } })

  api.use(preset)

  const errors = validate(api.config.toConfig())

  t.is(errors.length, 0)
})

test('valid preset development', t => {
  const api = Neutrino({ 'env': { NODE_ENV: 'development' } })

  api.use(preset)

  const errors = validate(api.config.toConfig())

  t.is(errors.length, 0)
})
