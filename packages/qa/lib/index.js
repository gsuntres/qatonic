require('chai/register-assert.js')
const QaTonic = require('./qa-tonic')
global.http = require('@qatonic/plugin-http')

const qa = new QaTonic()

global.QaTonic = QaTonic

module.exports = global.qa = qa
