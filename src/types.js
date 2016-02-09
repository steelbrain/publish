'use strict'

/* @flow */

export type Publish$Rule = {
  validate: ?((directory: string) => Promise<boolean>),
  prepare: ?((directory: string) => Promise<boolean>)
}
