const test = require('ava')
const atomsLookup = require('./lib/atoms-lookup')
const configLookup = require('./lib/config-lookup')
const createTasks = require('./lib/create-tasks')

let atoms
test.before(t => {
  atoms = atomsLookup(`${__dirname}/fixtures`)
})
test('atomsLookup returns installed atoms', t => {

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

test('createTasks create gulp tasks', t => {
  const mock = new GulpMock()
  const fn = createTasks(mock, opts)
  fn({
    name: 'test',
    help: 'test',
    task: () => {},
    watch: () => {},
    config: {}
  })

  t.is(mock.tasks.length, 4)
  t.is(mock.tasks.toString(), 'test,test:watch,test:foo,test:foo:watch')
})

class GulpMock {
  constructor () {
    this.tasks = []
  }
  task (name) {
    this.tasks.push(name)
  }
}
