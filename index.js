const Mocha = require('mocha')
const Context = require('./lib/context')
const path = require('path')
const fs = require('fs')
require('chai/register-assert')

global.http = require('@qatonic/plugin-http')

class QaTonic {

  constructor() {
    this._mocha = new Mocha({
      timeout: 10000,
      bail: true,
      slow: 1000
    })
    this._context = new Context()
    this._fixtures = {}
  }

  get mocha() {
    return this._mocha
  }

  get v() {
    return this._context.ctx
  }

  fixture(key, obj) {
    if(typeof key !== 'string') {
      throw new Error('key should be a string')
    }

    if(typeof obj === 'undefined') {
      return this._fixtures[key]
    } else if(typeof obj === 'null' && typeof this._fixtures[key] !== 'undefined') {
      delete this._fixtures[key]
    } else {
      this._fixtures[key] = Object.assign({}, obj)
      Object.freeze(this._fixtures[key])
    }
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
