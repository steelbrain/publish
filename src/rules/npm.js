'use strict'

/* @flow */

import Path from 'path'
import IgnoredParser from 'gitignore-parser'
import { readFile, fileExists, findAsync, spawn, shouldDump } from '../helpers'

const debugValidate = require('debug')('publish:validate:npm')
const debugPublish = require('debug')('publish:publish:npm')

export async function validate(directory: string): Promise {
  // Manifest existance validation
  const manifest = await findAsync(directory, 'package.json')
  if (!manifest) {
    debugValidate('No manifest file found, ignoring')
    return
  }
  debugValidate(`Manifest found at ${manifest}`)

  // Manifest content validation
  let manifestContents
  try {
    manifestContents = JSON.parse( await readFile(manifest) )
  } catch (_) {
    throw new Error(`Malformed or invalid manifest`)
  }
  if (!manifestContents.main) {
    throw new Error(`No 'main' found in manifest`)
  }

  // Main file validation
  const mainFile = Path.resolve(directory, manifestContents.main)
  if (!await fileExists(mainFile)) {
    throw new Error(`Main file ${mainFile} not found`)
  }

  // Main file ignored validation
  const ignoreFile = await findAsync(directory, '.npmignore')
  if (!ignoreFile) {
    debugValidate('No .npmignore found')
  } else {
    const ignoreRules = (await readFile(ignoreFile)).toString()
    const ignoreParser = IgnoredParser.compile(ignoreRules)
    const ignoreDirectory = Path.dirname(ignoreFile)
    const ideaExists = await fileExists(Path.join(Path.dirname(manifest), '.idea'))
    const appleExists = await fileExists(Path.join(Path.dirname(manifest), '.DS_Store'))
    if (ignoreParser.denies(Path.relative(ignoreDirectory, mainFile))) {
      throw new Error(`Main file ${mainFile} ignored by .npmignore`)
    } else if (ideaExists && !ignoreParser.denies('.idea')) {
      throw new Error(`.idea exists and is not ignored by .npmignore`)
    } else if (appleExists && !ignoreParser.denies('.DS_Store')) {
      throw new Error(`.DS_Store exists and is not ignored by .npmignore`)
    }
  }

  debugValidate('All rules passed')
}

export async function publish(directory: string, bump: string): Promise {
  debugPublish(`Gonna do 'npm version ${bump}'`)
  let data
  data = await spawn('npm', ['version', bump], directory)
  if (data.exitCode !== 0 || data.stdout.indexOf('ERR') !== -1 || data.stderr.indexOf('ERR') !== -1) {
    if (shouldDump()) {
      debugPublish(`STDOUT: ${data.stdout}`)
      debugPublish(`STDERR: ${data.stderr}`)
    }
    throw new Error('NPM exited with an error')
  }
  debugPublish(`Gonna do 'npm publish'`)
  data = await spawn('npm', ['publish'], directory)
  if (data.exitCode !== 0 || data.stdout.indexOf('ERR') !== -1 || data.stderr.indexOf('ERR') !== -1) {
    if (shouldDump()) {
      debugPublish(`STDOUT: ${data.stdout}`)
      debugPublish(`STDERR: ${data.stderr}`)
    }
    throw new Error('NPM exited with an error')
  }
  debugPublish(`Gonna do 'git push origin HEAD --follow-tags'`)
  data = await spawn('git', ['push', 'origin', 'HEAD', '--follow-tags'], directory)
  if (data.exitCode !== 0) {
    if (shouldDump()) {
      if (shouldDump()) {
        debugPublish(`STDOUT: ${data.stdout}`)
        debugPublish(`STDERR: ${data.stderr}`)
      }
      throw new Error('Git exited with an error')
    }
  }
  debugPublish(`NPM execution succeeded`)
}
