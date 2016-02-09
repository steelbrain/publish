'use strict'

import { readFile, fileExists, findAsync } from '../helpers'

const debugPrepare = require('debug')('publish:prepare:ucompiler')

export async function prepare(directory: string): Promise {
  debugPrepare('I\'m here')
}
