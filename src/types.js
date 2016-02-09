'use strict'

/* @flow */

export type Publish$Rule = {
  name: string,
  execute: ((directory: string) => Promise<boolean>)
}

export type Publish$Bump = 'major' | 'minor' | 'patch'
