const SCOPES = Object.freeze({ GLOBAL: Symbol('global') })

class Context {

  constructor(initCtx = {}) {
    this._initCtx = Object.assign({}, initCtx)
    this._ctx = Object.assign({}, initCtx)
  }

  update(key, value, scope = SCOPES.GLOBAL) {
    if(typeof key === 'undefined' || key === null)
      throw new Error('Failed to update context, invalid key')

    switch(scope) {
    case SCOPES.GLOBAL:
      this._ctx[key] = value
      break
    default:
      throw new Error(`Faild to update context, unknown scope \`${scope}\``)
    }
  }

  reset(scope  = SCOPES.GLOBAL) {
    switch(scope) {
    case SCOPES.GLOBAL:
      this._resetObj(this._ctx, this._initCtx)
      break
    default:
      throw new Error(`Faild to reset context, unknown scope \`${scope}\``)
    }
  }

  env(name) {
    return this._env[name]
  }

  get ctx() {
    return Object.assign({}, this._ctx)
  }

  _resetObj(obj, initObj = {}) {
    for (const key of Object.getOwnPropertyNames(obj)) {
      if(initObj[key]) {
        obj[key] = initObj[key]
      } else {
        delete obj[key]
      }
    }
  }

}

Context.SCOPES = SCOPES

module.exports = Context
