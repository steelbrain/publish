'use strict'

/* @flow */

import { scanRules } from './helpers'

export async function execute(directory: string): Promise {
  await prepare(directory)
  await validate(directory)
}

export async function prepare(directory: string): Promise {

}

export async function validate(directory: string): Promise {
  const rules = await scanRules(directory, 'validate')
  for (const rule of rules) {
    await rule.validate(directory)
  }
}
