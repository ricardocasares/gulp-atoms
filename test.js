const test = require('ava')
const atomsLookup = require('./lib/atoms-lookup')
const configLookup = require('./lib/config-lookup')

let atoms
test.before(t => {
  atoms = atomsLookup(`${__dirname}/fixtures`)
})
test('atomsLookup return', t => {

  t.true(Array.isArray(atoms))
  t.is(atoms.pop().name, 'test')
})

let cfg, opts
test.before(t => {
  opts = {
    test: {
      foo: 'bar'
    },
    'test:foo': {
      foo: 'niet',
      overriden: 'yes please'
    }
  }
  cfg = configLookup(atoms[0], opts)
})

test('configLookup returns an object', t => {
  t.is(typeof cfg, 'object')
})

test('configLookup merges default atom config object', t => {
  t.is(cfg['test:foo'].remain, true)
})

test('configLookup given configuration overrides default', t => {
  t.is(cfg['test:foo'].overriden, 'yes please')
})
