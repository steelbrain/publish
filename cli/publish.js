#!/usr/bin/env node
'use strict'

/* @flow */

global.__sb__publish = true
process.env.DEBUG = 'publish:*'

if (parseInt(process.version.substr(1).split('.')[0]) < 5) {
  console.error('Required minimum node version is node v5')
  process.exit(1)
}

const publish = require('../')
const parameters = process.argv.slice(2)
const firstParameter = parameters[0]
const secondParameter = parameters[1]

if (secondParameter && (secondParameter === 'major' || secondParameter === 'minor' || secondParameter === 'patch')) {
  publish.execute(process.cwd(), firstParameter, secondParameter).catch(function(e) {
    console.log(e)
    process.exit(1)
  })
} else if (firstParameter === 'prepare') {
  publish.prepare(process.cwd()).catch(function(e) {
    console.log(e)
    process.exit(1)
  })
} else if (firstParameter === 'validate') {
  publish.validate(process.cwd()).catch(function(e) {
    console.log(e)
    process.exit(1)
  })
} else {
  console.log(`Package Usage
    $ publish prepare
    $ publish validate
    $ publish apm|npm major|minor|patch
    `.trim())
  process.exit(1)
}
