#!/usr/bin/env node
'use strict'

/* @flow */

global.__sb__publish = true
process.env.DEBUG = 'publish:*'

if (parseInt(process.version.substr(1).split('.')[0]) < 5) {
  console.error('Required minimum node version is node v5')
  process.exit(1)
}

require('../').execute(process.cwd()).catch(function(error) {
  console.error(error)
  process.exit(1)
})
