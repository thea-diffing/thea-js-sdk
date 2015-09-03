'use strict';

var url = require('url');
var assert = require('chai').assert;
var fetch = require('node-fetch');

function makePostJsonRequest(url, json) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(function(response) {
    var json = response.json();

    if (response.status >= 300) {
      var error = new Error(response.statusText);
      error.response = response;
      throw error;
    }

    return json;
  });
}

function TheaSdk(config) {
  assert.isObject(config);
  assert.isString(config.api);

  var apiUrl = url.parse(config.api);
  assert.notInclude(apiUrl.pathname, '/api');

  apiUrl.pathname += 'api';

  this.api = url.format(apiUrl);
}

TheaSdk.prototype = {
  getEndpoint: function(endpoint) {
    var apiUrl = url.parse(this.api);
    apiUrl.pathname += '/' + endpoint;

    return url.format(apiUrl);
  },

  setProject: function(projectId) {
    assert.isString(projectId);

    this.projectId = projectId;
  },

  createProject: function(body) {
    assert.isObject(body);

    var endpoint = this.getEndpoint('createProject');

    return makePostJsonRequest(endpoint, body);
  },

  startBuild: function(body) {
    assert.isObject(body);

    var endpoint = this.getEndpoint('startBuild');

    if (!body.project) {
      assert.isDefined(this.projectId);

      body.project = this.projectId;
    }

    return makePostJsonRequest(endpoint, body);
  }
};

module.exports = TheaSdk;
