'use strict';

var url = require('url');
var assert = require('chai').assert;

function TheaSdk(config) {
  assert.isObject(config);
  assert.isString(config.api);

  var apiUrl = url.parse(config.api);
  assert.notInclude(apiUrl.pathname, '/api');

  apiUrl.pathname += 'api';

  this.api = url.format(apiUrl);
}

TheaSdk.prototype = {
  createProject: function() {

  }
};

module.exports = TheaSdk;
