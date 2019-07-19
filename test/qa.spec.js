const QaTonic = require('../lib/qa-tonic')

describe('Qa Tonic ', () => {

  describe('Commands', () => {
    it('Add a command', () => {
      const qa = new QaTonic()

      QaTonic.Commands.add('mycmd', function() {
        return 'foo'
      })

      assert.equal(qa.mycmd(), 'foo')
    })
  })

})
