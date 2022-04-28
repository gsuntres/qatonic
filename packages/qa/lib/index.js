const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

require('chai/register-assert.js')

chai.use(chaiAsPromised)

const QaTonic = require('./qa-tonic')

global.http = require('@qatonic/plugin-http')

const qa = new QaTonic()

global.QaTonic = QaTonic

module.exports = global.qa = qa
