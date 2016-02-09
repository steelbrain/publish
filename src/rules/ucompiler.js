'use strict'

import { readFile, fileExists, findAsync, spawn } from '../helpers'

const debugPrepare = require('debug')('publish:prepare:ucompiler')

export async function prepare(directory: string): Promise {
  const config = await findAsync(directory, '.ucompiler')
  if (!config) {
    debugPrepare('No UCompiler configuration found, ignoring')
    return
  }
  debugPrepare(`UCompiler configuration found at ${config}`)
  debugPrepare('Spawning UCompiler')
  const data = await spawn('ucompiler', ['go'])
  if (data.exitCode !== 0 && data.stdout.indexOf('Error') !== -1 || data.stderr.indexOf('Error') !== -1) {
    throw new Error('UCompiler exited with an error')
  }
  debugPrepare('UCompiler execution succeeded')
}
