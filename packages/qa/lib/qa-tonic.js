const path = require('path')
const fs = require('fs')
const Mocha = require('mocha')
const Context = require('./context')
const {
  readFile,
  open
} = fs.promises

class QaTonic {

  constructor() {
    this._mocha = new Mocha({
      timeout: 60000,
      bail: true,
      slow: 1000,

    })

    this._context = new Context()
    this._fixtures = {}
    this._env = {}
  }

  async init() {
    try {
      this._env = JSON.parse(await readFile(path.join(process.cwd(), 'qa.env.json'), 'utf8'))
    } catch (err) { } // eslint-disable-line no-empty

    this._FIXTURE_DIR = path.resolve(path.join(process.cwd(), 'fixtures'))
  }

  get mocha() {
    return this._mocha
  }

  get v() {
    return this._context.ctx
  }

  env(name) {
    return this._env[name]
  }

  register(data) {
    for (let key in data) {
      this._context.update(key, data[key])
    }
  }

  // utility func to merge objects properly.
  merge() {
    const objMergable = []
    for (let i = 0; i !== arguments.length; i++) {
      if (typeof arguments[i] === 'object') {
        objMergable.push(arguments[i])
      }
    }

    return Object.assign.apply(null, [{}].concat(objMergable))
  }

  async loadFiles() {
    const integrationDir = path.resolve(path.join(process.cwd(), 'integration'))

    let filehandle
    try {
      filehandle = await open(integrationDir, 'r');
      for (const file of fs.readdirSync(integrationDir)) {
        this._mocha.addFile(path.join(integrationDir, file))
      }
    } finally {
      await filehandle?.close();
    }

    return Promise.resolve({})
  }

  async loadSupport() {
    const supportDir = path.join(process.cwd(), 'support')

    let fileHandle
    try {
      fileHandle = await open(supportDir, 'r');
      require(supportDir)
    } finally {
      await fileHandle?.close();
    }

    return Promise.resolve({})
  }

  fixture(name, varName) {
    let fix
    if (this._fixtures[name]) {
      fix = this._fixtures[name]
    } else {
      fix = require(`${this._FIXTURE_DIR}/${name}.json`)
      this._fixtures[name] = fix
    }

    if (varName) {
      const obj = {}
      obj[varName] = fix
      this.register(obj)
    }

    return fix
  }

  // in ms
  wait(timeout = 1000) {
    return new Promise((resolve) => setTimeout(resolve, timeout))
  }
}

QaTonic.Commands = {
  add(name, f) {
    if (QaTonic.prototype[name]) {
      throw new Error(`Cannot add ${name}`)
    }

    QaTonic.prototype[name] = f
  }
}

module.exports = QaTonic