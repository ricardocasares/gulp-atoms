const fs = require('fs')
const path = require('path')
const C = require('./constants')
const byText = require('./utils').byText

// Finds and requires atoms inside your packages
module.exports = function atomsLookup (src) {
  const join = path.join
  const packages = src || join(process.cwd(), C.modules)
  const load = atom => require(join(packages, atom))
  const lookup = src => fs
    .readdirSync(src)
    .filter(file => fs
      .statSync(join(src, file))
      .isDirectory())
    .filter(byText(C.afix))
    .map(load)

  return lookup(packages)
}
