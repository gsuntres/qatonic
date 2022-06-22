const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

require('chai/register-assert.js')

chai.use(chaiAsPromised)

const QaTonic = require('./qa-tonic')

global.http = require('@qatonic/plugin-http')
global._ = require('lodash')

const qa = new QaTonic()
qa.init()

global.QaTonic = QaTonic

module.exports = global.qa = qa
