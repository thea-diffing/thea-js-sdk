# thea-js-sdk

[![Build Status](https://travis-ci.org/thea-diffing/thea-js-sdk.svg)](https://travis-ci.org/thea-diffing/thea-js-sdk)
[![devDependency Status](https://david-dm.org/thea-diffing/thea-js-sdk.svg)](https://david-dm.org/thea-diffing/thea-js-sdk#info=devDependencies)
[![devDependency Status](https://david-dm.org/thea-diffing/thea-js-sdk/dev-status.svg)](https://david-dm.org/thea-diffing/thea-js-sdk#info=devDependencies)

Use this module to interface with a Thea API instance.

## Installation

```sh
$ npm install thea-js-sdk --save-dev
```

## Usage

### `.constructor({ string api [, string project] })`

```
var theaSdk = new TheaSdk({
  api: 'https://my-thea-instance.com'
});
```

```
var theaSdk = new TheaSdk({
  api: 'https://my-thea-instance.com',
  project: '092f9894-26b0-4482-9eba-c287cb99fc62'
});
```

The api should not include `/api`.

A project can be set in the constructor to be utilized with other functions like `startBuild` and `upload`.

If it is not specified in the constructor, it can be specified with `setProject`.

### `.setProject(string project)`

```
theaSdk.setProject('092f9894-26b0-4482-9eba-c287cb99fc62');
```

### `.createProject(object body)`
This is passed through to the API server. Use this to specify configuration options for the project.

```
theaSdk.createProject({
  service: {
    name: 'github',
    options: {
      user: 'thea-diffing',
      repository: 'thea-js-sdk'
    }
  }
});
```

### `.startBuild(object body)`
This is passed through to the API server. If `body.project` is specified it will override the project specified with `setProject`.

```
theaSdk.startBuild({
  head: headSha,
  base: baseSha,
  numBrowsers: 3
});
```

### `.upload(object body)`
Upload a folder of images to the API server. If `body.project` is specified it will override the project specified with `setProject`.

```
theaSdk.upload({
  sha: currentSha,
  browser: 'Chrome',
  imagePath: savedImagesPath
});
```
