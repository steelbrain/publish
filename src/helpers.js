'use strict'

/* @flow */

import FS from 'fs'
import Path from 'path'
import promisify from 'sb-promisify'
import { spawn as spawnProcess } from 'child_process'
import { Publish$Rule } from './types'

export function fileExists(path: string): Promise<boolean> {
  return new Promise(function(resolve) {
    // $FlowIgnore: FS.R_OK not yet recognized
    FS.access(path, FS.R_OK, function(error) {
      resolve(error === null)
    })
  })
}

export const readFile = promisify(FS.readFile)
export const writeFile = promisify(FS.writeFile)
export const readdir = promisify(FS.readdir)

export async function scanRules(directory: string, type: 'validate' | 'prepare'): Promise<Array<Publish$Rule>> {
  const rules = []
  const rulesDirectory = Path.join(__dirname, 'rules')
  for (const file of await readdir(rulesDirectory)) {
    const filePath = Path.join(rulesDirectory, file)
    // $FlowIgnore: I know I'm requiring a dynamic path
    const rule = require(filePath)
    if (type === 'validate' && rule.validate) {
      rules.push(rule)
    } else if (type === 'prepare' && rule.prepare) {
      rules.push(rule)
    }
  }
  return rules
}

export async function findAsync(directory: string, name: string | Array<string>): Promise<?string> {
  const names = [].concat(name)
  const chunks = directory.split(Path.sep)

  while (chunks.length) {
    let currentDir = chunks.join(Path.sep)
    if (currentDir === '') {
      currentDir = Path.resolve(directory, '/')
    }
    for (const fileName of names) {
      const filePath = Path.join(currentDir, fileName)
      if (await fileExists(filePath)) {
        return filePath
      }
    }
    chunks.pop()
  }

  return null
}

export function spawn(program: string, parameters: Array<string>, directory: string): Promise<{stdout: string, stderr: string, exitCode: number}> {
  const shouldDump = global.__sb__publish === true

  return new Promise(function(resolve, reject) {
    const child = spawnProcess(program, parameters, {
      cwd: directory
    })
    const data = { stdout: [], stderr: [] }
    child.stdout.on('data', function(chunk) {
      data.stdout.push(chunk)
      if (shouldDump) {
        process.stdout.write(chunk)
      }
    })
    child.stderr.on('data', function(chunk) {
      data.stderr.push(chunk)
      if (shouldDump) {
        process.stderr.write(chunk)
      }
    })
    child.on('close', function(exitCode) {
      resolve({
        stdout: data.stdout.join(''),
        stderr: data.stderr.join(''),
        exitCode: exitCode
      })
    })
    child.on('error', function(error) {
      reject(error)
    })
  })
}
