const merge = require('deepmerge')
const {byText, keys} = require('./utils')

// Looks for different atom configurations
module.exports = function configLookup (atom, opts) {
  const toObject = (x, y) => {
    x[y] = merge(atom.config, opts[y])
    return x
  }

  const configs = keys(opts)
    .filter(byText(atom.name))
    .reduce(toObject, {})

  const defaultConfig = { [atom.name]: atom.config }

  return keys(configs).length
    ? configs
    : defaultConfig
}
