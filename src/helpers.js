'use strict'

/* @flow */

import FS from 'fs'
import Path from 'path'
import promisify from 'sb-promisify'
import { Publish$Rule } from './types'

export function fileExists(path: string): Promise<boolean> {
  return new Promise(function(resolve) {
    // $FlowIgnore: FS.R_OK not yet recognized
    FS.access(path, FS.R_OK, function(error) {
      resolve(error !== null)
    })
  })
}

export const readFile = promisify(FS.readFile)
export const writeFile = promisify(FS.writeFile)
export const readdir = promisify(FS.readdir)

export async function scanRules(directory: string, type: 'validate'): Promise<Array<Publish$Rule>> {
  const rules = []
  const rulesDirectory = Path.join(__dirname, 'rules')
  for (const file of await readdir(rulesDirectory)) {
    const filePath = Path.join(rulesDirectory, file)
    // $FlowIgnore: I know I'm requiring a dynamic path
    const rule = require(filePath)
    if (type === 'validate' && rule.validate) {
      rules.push(rule)
    }
  }
  return rules
}
