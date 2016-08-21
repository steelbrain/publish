'use strict'

/* @flow */

import { scanRules } from './helpers'
import type { Publish$Bump } from './types'

export async function execute(directory: string, ruleName: string, bump: Publish$Bump): Promise<void> {
  await prepare(directory)
  await validate(directory)
  await publish(directory, ruleName, bump)
}

export async function prepare(directory: string): Promise<void> {
  const rules = await scanRules(directory, 'prepare')
  for (const rule of rules) {
    await rule.execute(directory)
  }
}

export async function validate(directory: string): Promise<void> {
  const rules = await scanRules(directory, 'validate')
  for (const rule of rules) {
    await rule.execute(directory)
  }
}

export async function publish(directory: string, ruleName: string, bump: Publish$Bump): Promise<void> {
  const rules = await scanRules(directory, 'publish')
  let requiredRule
  for (const rule of rules) {
    if (rule.name === ruleName) {
      requiredRule = rule
      break
    }
  }
  if (!requiredRule) {
    throw new Error(`Publish rule ${ruleName} not fond`)
  }
  await requiredRule.execute(directory, bump)
}
