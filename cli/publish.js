#!/usr/bin/env node
'use strict'

/* @flow */

process.env.DEBUG = 'publish:*'

if (parseInt(process.version.substr(1).split('.')[0]) < 5) {
  console.error('Required minimum node version is node v5')
  process.exit(1)
}

require('../').execute(process.cwd()).catch(function(error) {
  console.error(error.stack || error)
  process.exit(1)
})
