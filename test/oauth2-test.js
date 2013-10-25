require('./test-helper')
var EventbriteStrategy = require('../lib/passport-eventbrite-oauth/oauth2');


describe('EventbriteStrategy', function() {
  beforeEach(function() {
    this.strategy = new EventbriteStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret'
    }, function() {});
  })

  it('should be named eventbrite', function() {
    this.strategy.name.should.equal('eventbrite')
  })

  describe.only('strategy authorization params', function() {
    it('should return empty object when parsing invalid options', function() {
      var params = this.strategy.authorizationParams({foo: 'bar'})
      Object.keys(params).length.should.equal(0)
    })

    it('should return access_type', function () {
      var params = this.strategy.authorizationParams({ accessType: 'offline' });
      params.access_type.should.equal('offline');
    })

    it('should return approval_prompt', function () {
      var params = this.strategy.authorizationParams({ approvalPrompt: 'force' });
      params.approval_prompt.should.equal('force');
    })

    it('should return prompt', function () {
      var params = this.strategy.authorizationParams({ prompt: 'consent' });
      params.prompt.should.equal('consent')
    })

    it('should return login_hint', function () {
      var params = this.strategy.authorizationParams({ loginHint: 'bob@gmail.com' });
      params.login_hint.should.equal('bob@gmail.com')
    })
    it('should return user_id', function () {
      var params = this.strategy.authorizationParams({ userID: 'bob@gmail.com' });
      params.user_id.should.equal('bob@gmail.com')
    })
    it('should return hd from hostedDomain option', function () {
      var params = this.strategy.authorizationParams({ hostedDomain: 'mycollege.edu' });
      params.hd.should.equal('mycollege.edu')
    })
    it('should return hd from hd option', function () {
      var params = this.strategy.authorizationParams({ hd: 'mycollege.edu' });
      params.hd.should.equal('mycollege.edu')
    })
    it('should return access_type and approval_prompt', function () {
      var params = this.strategy.authorizationParams({ accessType: 'offline', approvalPrompt: 'force' });
      params.access_type.should.equal('offline')
      params.approval_prompt.should.equal('prompt')
    })
  })

  describe.skip('strategy when loading user profile', function() {
    beforeEach(function() {
      this.strategy._oauth2.get = function(x, y, callback) {
        console.log('HAIIIIIIIIIII')
        var body = '{ \
         "id": "00000000000000", \
         "email": "fred.example@gmail.com", \
         "verified_email": true, \
         "name": "Fred Example", \
         "given_name": "Fred", \
         "family_name": "Example", \
         "picture": "https://lh5.eventbriteusercontent.com/-2Sv-4bBMLLA/AAAAAAAAAAI/AAAAAAAAABo/bEG4kI2mG0I/photo.jpg", \
         "gender": "male", \
         "locale": "en-US" \
        }';

        callback(null, body, undefined);
      }
    })

    describe('when told to load user profile', function() {
      beforeEach(function(done) {
        var self = this
        process.nextTick(function() {
          self.strategy.userProfile('access-token', function(err, profile) {
            console.dir(err)
            console.dir(profile)
            self.error = err
            self.profile = profile
            done()
          })
        })
      })

      it('should not error', function() {
        should.not.exist(this.err)
      })
      it('should load profile', function() {
        this.profile.provider.should.equal('eventbrite');
        this.profile.id.should.equal('00000000000000');
        this.profile.displayName.should.equal('Fred Example');
        this.profile.name.familyName.should.equal('Example');
        this.profile.name.givenName.should.equal('Fred');
        this.profile.emails[0].value.should.equal('fred.example@gmail.com');
      })
      it('should set raw property', function() {
        _.isString(this.profile._raw).should.equal(true)
      })
      it('should set json property', function() {
        this.profile._json.should.be.an.instanceOf(Object)
      })
    })
  })
})

//.addBatch({
//  'strategy when loading user profile': {
//    'when told to load user profile': {
//      topic: function(strategy) {
//        var self = this;
//        function done(err, profile) {
//          self.callback(err, profile);
//        }
//
//        process.nextTick(function () {
//          strategy.userProfile('access-token', done);
//        });
//      },
//
//    },
//  },
//
//  'strategy when loading user profile and encountering an error': {
//    topic: function() {
//      var strategy = new EventbriteStrategy({
//        clientID: 'ABC123',
//        clientSecret: 'secret'
//      },
//      function() {});
//
//      // mock
//      strategy._oauth2.get = function(url, accessToken, callback) {
//        callback(new Error('something-went-wrong'));
//      }
//
//      return strategy;
//    },
//
//    'when told to load user profile': {
//      topic: function(strategy) {
//        var self = this;
//        function done(err, profile) {
//          self.callback(err, profile);
//        }
//
//        process.nextTick(function () {
//          strategy.userProfile('access-token', done);
//        });
//      },
//
//      'should error' : function(err, req) {
//        assert.isNotNull(err);
//      },
//      'should wrap error in InternalOAuthError' : function(err, req) {
//        assert.equal(err.constructor.name, 'InternalOAuthError');
//      },
//      'should not load profile' : function(err, profile) {
//        assert.isUndefined(profile);
//      },
//    },
//  },
//
//}).export(module);
