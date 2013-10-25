require('./test-helper')
var eventbrite = require( '../lib/passport-eventbrite-oauth' );

describe( 'passport-eventbrite-oauth', function() {
  describe('module', function() {
    it('should report a version', function() {
      _.isString(eventbrite.version).should.equal(true)
    })

    it('should export 0Auth 2.0 strategy', function() {
      eventbrite.OAuth2Strategy.should.be.an.instanceOf(Function)
    })
  })
})
