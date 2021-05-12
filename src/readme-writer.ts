import * as fs from 'fs'
import {EOL} from 'os'
import * as prettier from 'prettier'

import {endTokenFormat, startTokenFormat} from './config'
import {LogTask} from './logtask'

export function updateReadme(content: string[], tokenName: string, readmePath: string): void {
  const log = new LogTask('readme-writer')

  log.info(`Looking for the ${tokenName} token in ${readmePath}`)
  // Load the README
  const originalReadme = fs.readFileSync(readmePath).toString()

  const startToken = startTokenFormat.replace('%s', tokenName)
  const endToken = endTokenFormat.replace('%s', tokenName)

  // Find the start token
  const startTokenIndex = originalReadme.indexOf(startToken)
  if (startTokenIndex < 0) {
    throw new Error(`Start token '${startToken}' not found`)
  }
  log.info(`Found the start ${tokenName} token`)

  // Find the end token
  const endTokenIndex = originalReadme.indexOf(endToken)
  if (endTokenIndex < 0) {
    throw new Error(`End token '${endToken}' not found`)
  } else if (endTokenIndex < startTokenIndex) {
    throw new Error('Start token must appear before end token')
  }
  log.info(`Found the end ${tokenName} token`)
  // Build the new README
  const newReadme: string[] = []
  const len: number = startToken.length

  // Append the beginning
  newReadme.push(originalReadme.substr(0, startTokenIndex + len))
  // Append the new contents
  newReadme.push(...content)
  // Append the end
  newReadme.push(originalReadme.substr(endTokenIndex))
  const fileContent = newReadme.join(EOL)
  // Write the new README
  fs.writeFileSync(readmePath, prettier.format(fileContent, {semi: false, parser: 'markdown'}))
  log.info(`successfully updated the ${tokenName} section`)
}