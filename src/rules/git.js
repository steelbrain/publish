'use strict'

/* @flow */

import Path from 'path'
import IgnoredParser from 'gitignore-parser'
import { readFile, fileExists, findAsync } from '../helpers'

const debugValidate = require('debug')('publish:validate:git')

export async function validate(directory: string): Promise {
  // Repository existance
  const repositoryRoot = await findAsync(directory, '.git')
  if (!repositoryRoot) {
    debugValidate(`No repository found in ${directory}, ignoring`)
    return
  }
  debugValidate(`Repository found at ${directory}`)

  // ignore validation
  const ideaExists = (await fileExists(Path.join(directory, '.idea'))) || (await fileExists(Path.join(repositoryRoot, '.idea')))
  const ignoreFile = await findAsync(directory, '.gitignore')
  if (!ignoreFile) {
    debugValidate(`No .gitignore found`)
    if (ideaExists) {
      throw new Error(`.idea exists and is not ignored by .gitignore`)
    }
  } else {
    const ignoreRules = (await readFile(ignoreFile)).toString()
    const ignoreParser = IgnoredParser.compile(ignoreRules)
    const ignoreDirectory = Path.dirname(ignoreFile)
    if (ideaExists && !ignoreParser.denies('.idea')) {
      throw new Error(`.idea exists and is not ignored by .gitignore`)
    }
  }

  debugValidate(`All rules passed`)
}
