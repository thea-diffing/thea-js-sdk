'use strict';

var nock = require('nock');
var sinon = require('sinon-sandbox');
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

    describe('#setProject', function() {
      it('should set the projectId', function() {
        assert.isUndefined(theaSdk.projectId);

        theaSdk.setProject('4213');

        assert.strictEqual(theaSdk.projectId, '4213');
      });
    });

    describe('#startBuild', function() {
      var makePostJsonRequestOriginal;
      var makePostJsonRequestStub;

      beforeEach(function() {
        makePostJsonRequestStub = sinon.stub();

        makePostJsonRequestOriginal = TheaSdk.__get__('makePostJsonRequest');
        TheaSdk.__set__('makePostJsonRequest', makePostJsonRequestStub);
      });

      afterEach(function() {
        TheaSdk.__set__('makePostJsonRequest', makePostJsonRequestOriginal);
      });

      it('should call makePostJsonRequest with endpoint', function() {
        theaSdk.startBuild({
          browser: 'chrome',
          project: 'foo'
        });

        assert.calledWith(
          makePostJsonRequestStub,
          url + '/api/startBuild',
          sinon.match.object
        );
      });

      it('should call makePostJsonRequest with body if includes project', function() {
        theaSdk.startBuild({
          browser: 'chrome',
          project: 'foo'
        });

        assert.calledWith(
          makePostJsonRequestStub,
          sinon.match.string,
          {
            browser: 'chrome',
            project: 'foo'
          }
        );
      });

      it('should call makePostJsonRequest with project if does not include project and project set', function() {
        theaSdk.setProject('bar');

        theaSdk.startBuild({
          browser: 'chrome'
        });

        assert.calledWith(
          makePostJsonRequestStub,
          sinon.match.string,
          {
            browser: 'chrome',
            project: 'bar'
          }
        );
      });

      it('should throw if project is not specified and not set', function() {
        assert.throws(function() {
          theaSdk.startBuild({
            browser: 'chrome'
          });
        });
      });
    });
  });
});
