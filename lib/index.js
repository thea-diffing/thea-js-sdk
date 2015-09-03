'use strict';

var url = require('url');
var assert = require('chai').assert;
var fetch = require('node-fetch');
var targz = require('tar.gz')();
var FormData = require('form-data');
var fs = require('fs-extra');

function parseResponse(response) {
  var json = response.json();

  if (response.status !== 200) {
    var responseText = response.body.read().toString();
    var responseJSON = JSON.parse(responseText);
    var error = new Error(responseJSON.message);
    error.response = response;
    error.json = responseJSON;
    throw error;
  }

  return json;
}

function makePostRequest(url, body) {
  return fetch(url, {
    method: 'POST',
    body: body
  })
  .then(parseResponse);
}

function makePostJsonRequest(url, json) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(json),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(parseResponse);
}

function TheaSdk(config) {
  assert.isObject(config);
  assert.isString(config.api);

  var apiUrl = url.parse(config.api);
  assert.notInclude(apiUrl.pathname, '/api');

  apiUrl.pathname += 'api';

  this.api = url.format(apiUrl);

  if (config.project) {
    this.setProject(config.project);
  }
}

TheaSdk.prototype = {
  getEndpoint: function(endpoint) {
    var apiUrl = url.parse(this.api);
    apiUrl.pathname += '/' + endpoint;

    return url.format(apiUrl);
  },

  setProject: function(project) {
    assert.isString(project);

    this.project = project;
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
      assert.isDefined(this.project);

      body.project = this.project;
    }

    return makePostJsonRequest(endpoint, body);
  },

  upload: function(options) {
    assert.isObject(options);
    assert.isString(options.sha);
    assert.isString(options.browser);
    assert.isString(options.imagePath);
    var project = options.project || this.project;

    assert.isString(project);

    var endpoint = this.getEndpoint('upload');
    var tarPath = options.imagePath + '-tmp.tar.gz';

    var form = new FormData();
    form.append('project', project);
    form.append('sha', options.sha);
    form.append('browser', options.browser);

    return targz.compress(options.imagePath, tarPath)
    .then(function() {
      form.append('images', fs.createReadStream(tarPath));
    })
    .then(function() {
      return makePostRequest(endpoint, form);
    })
    .then(function(result) {
      fs.unlinkSync(tarPath);

      return result;
    });
  }
};

module.exports = TheaSdk;
