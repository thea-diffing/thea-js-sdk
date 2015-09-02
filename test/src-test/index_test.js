'use strict';

var nock = require('nock');
var assert = require('chai').assert;
var TheaSdk = require('../../');

describe('module/thea', function() {
  describe('#constructor', function() {
    it('should throw if not given an object with api', function() {
      assert.throws(function() {
        new TheaSdk();
      });

      assert.throws(function() {
        new TheaSdk('foo');
      });

      assert.throws(function() {
        new TheaSdk({});
      });
    });

    it('should throw if given a url that contains api', function() {
      assert.throws(function() {
        new TheaSdk({
          api: 'https://myurl.com/api'
        });
      });
    });

    it('should not throw if given a good url', function() {
      assert.doesNotThrow(function() {
        new TheaSdk({
          api: 'https://myurl.com'
        });
      });
    });

    it('should set api with /api if given url without trailing slash', function() {
      var expected = 'https://myurl.com/api';

      var theaWithoutTrailing = new TheaSdk({
        api: 'https://myurl.com'
      });

      var theaWithTrailing = new TheaSdk({
        api: 'https://myurl.com/'
      });

      assert.strictEqual(theaWithoutTrailing.api, expected);
      assert.strictEqual(theaWithTrailing.api, expected);
    });
  });

  describe('with a thea sdk', function() {
    var url;
    var theaSdk;

    beforeEach(function() {
      url = 'http://example.com';

      theaSdk = new TheaSdk({
        api: url
      });
    });

    describe('#createProject', function() {
      it('should post to the api and return response', function() {
        nock(url)
          .post('/api/createProject', {
            service: {
              name: 'github'
            }
          })
          .reply(200, {
            key: 'value'
          });

        return theaSdk.createProject({
          service: {
            name: 'github'
          }
        })
        .then(function(response) {
          assert.strictEqual(response.key, 'value');
        });
      });

      it('should reject on failure', function() {
        nock(url)
          .post('/api/createProject')
          .reply(400, {
            status: 'failure',
            message: 'why'
          });

        return theaSdk.createProject({})
        .then(function() {
          assert.fail();
        }, function(error) {
          assert.instanceOf(error, Error);
        });
      });
    });
  });
});
