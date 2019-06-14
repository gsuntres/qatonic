const Mocha = require('mocha')
const Context = require('./lib/context')
const path = require('path')
const fs = require('fs')
require('chai/register-assert')

global.http = require('@qatonic/plugin-http')

class QaTonic {

  constructor() {
    this._mocha = new Mocha({
      timeout: 10000
    })
    this._context = new Context()
  }

  get mocha() {
    return this._mocha
  }

  get v() {
    return this._context.ctx
  }

  loadFiles() {
    const testDir = path.resolve(path.join(process.cwd(), 'test'))

    // load the rest
    fs.readdirSync(testDir)
      .forEach(file => this._mocha.addFile(path.join(testDir, file)))
  }

  register(data) {
    for(let key in data) {
      this._context.update(key, data[key])
    }
  }
}

const qa = new QaTonic()

module.exports = global.qa = qa
