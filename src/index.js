'use strict'

/* @flow */

import invariant from 'assert'
import { scanRules } from './helpers'

export async function execute(directory: string): Promise {
  await prepare(directory)
  await validate(directory)
}

export async function prepare(directory: string): Promise {
  const rules = await scanRules(directory, 'prepare')
  for (const rule of rules) {
    invariant(typeof rule.prepare === 'function')
    await rule.prepare(directory)
  }
}

export async function validate(directory: string): Promise {
  const rules = await scanRules(directory, 'validate')
  for (const rule of rules) {
    invariant(typeof rule.validate === 'function')
    await rule.validate(directory)
  }
}
