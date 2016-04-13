'use strict'

import { findAsync, spawn, shouldDump } from '../helpers'

const debugPrepare = require('debug')('publish:prepare:ucompiler')
const CONFIG_NAMES = ['.ucompiler', '.ucompiler.json']

export async function prepare(directory: string): Promise {
  const config = await findAsync(directory, CONFIG_NAMES)
  if (!config) {
    debugPrepare('No UCompiler configuration found, ignoring')
    return
  }
  debugPrepare(`UCompiler configuration found at ${config}`)
  debugPrepare('Spawning UCompiler')
  const data = await spawn('ucompiler', ['go'])
  if (data.exitCode !== 0 || data.stdout.indexOf('Error') !== -1 || data.stderr.indexOf('Error') !== -1) {
    if (shouldDump()) {
      debugPrepare(`STDOUT: ${data.stdout}`)
      debugPrepare(`STDERR: ${data.stderr}`)
    }
    throw new Error('UCompiler exited with an error')
  }
  debugPrepare('UCompiler execution succeeded')
}
