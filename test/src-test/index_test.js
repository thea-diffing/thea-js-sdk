'use strict';

var assert = require('chai').assert;
var TheaSdk = require('../../');

describe('module/index', function() {
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
});
