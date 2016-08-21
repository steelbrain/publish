'use strict'

/* @flow */

import { spawn, shouldDump } from '../helpers'

const debugPublish = require('debug')('publish:publish:apm')

export async function publish(directory: string, bump: string): Promise<void> {
  debugPublish(`Gonna do 'apm publish ${bump}'`)
  const data = await spawn('apm', ['publish', bump, '--color', 'false'], directory)
  if (
    data.exitCode !== 0 ||
    data.stdout.indexOf('ERR') !== -1 ||
    data.stderr.indexOf('ERR') !== -1 ||
    data.stdout.indexOf('failed') !== -1 ||
    data.stderr.indexOf('failed') !== -1
  ) {
    if (shouldDump()) {
      debugPublish(`STDOUT: ${data.stdout}`)
      debugPublish(`STDERR: ${data.stderr}`)
    }
    throw new Error('APM exited with an error')
  }
  debugPublish('APM execution succeeded')
}
