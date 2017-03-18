Publish
======

[![Greenkeeper badge](https://badges.greenkeeper.io/steelbrain/publish.svg)](https://greenkeeper.io/)

A publisher that makes sure everything is all right before your modules are published.

#### Checks performed

Publish check if
 - a manifest file does not exist
 - a manifest file is invalid
 - manifest's main file is ignored by npm ignored
 - manifest's main file does not exist
 - .idea directory is found and is not ignored by npm or git
 - .DS_Store file is found and is not ignored by npm or git

#### Installation

```js
npm install -g publish-helpers
```

#### Usage

```js
  $ publish prepare
  $ publish validate
  $ publish apm|npm major|minor|patch
```

#### License

This project is licensed under the terms of MIT license, see the LICENSE file for more info.
