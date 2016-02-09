'use strict'

/* @flow */

import { scanRules } from './helpers'
import type { Publish$Bump } from './types'

export async function execute(directory: string, ruleName: string, bump: Publish$Bump): Promise {
  await prepare(directory)
  await validate(directory)
  await publish(directory, ruleName, bump)
}

export async function prepare(directory: string): Promise {
  const rules = await scanRules(directory, 'prepare')
  for (const rule of rules) {
    await rule.execute(directory)
  }
}

export async function validate(directory: string): Promise {
  const rules = await scanRules(directory, 'validate')
  for (const rule of rules) {
    await rule.execute(directory)
  }
}

export async function publish(directory: string, ruleName: string, bump: Publish$Bump): Promise {

}
