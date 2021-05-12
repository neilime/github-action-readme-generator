import * as core from '@actions/core'
import * as chalk from 'chalk'
import * as emoji from 'node-emoji'

export class LogTask {
  constructor(readonly name: string) {}

  logStep(emojiStr: string, step: string, description: string): string {
    return `${emojiStr} ${step} ${this.name} ${description}`
  }

  start(description = ''): void {
    core.startGroup(this.logStep(emoji.get('rocket'), 'START', description))
  }
  info(description = ''): void {
    core.info(this.logStep(emoji.get('sparkles'), 'INFO ', description))
  }
  success(description = ''): void {
    core.info(this.logStep(emoji.get('white_check_mark'), 'SUCCESS', chalk.green(description)))
    core.endGroup()
  }
  fail(description = ''): void {
    core.endGroup()
    core.setFailed(this.logStep(emoji.get('x'), 'FAILURE', chalk.red(description)))
  }

  error(description = ''): void {
    core.error(this.logStep(emoji.get('x'), 'ERROR', chalk.bgRedBright(description)))
  }
  title(description = ''): void {
    core.info(this.logStep('📓', '#####', chalk.yellowBright(description)))
  }
}