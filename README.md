[![Build Status](https://github.com/abernier/ssrr/workflows/ci/cd/badge.svg)](https://github.com/abernier/ssrr/actions?query=workflow%3Aci%2Fcd)
[![NPM version](https://img.shields.io/npm/v/ssrr.svg?style=flat)](https://www.npmjs.com/package/ssrr)
![David](https://img.shields.io/david/abernier/ssrr)
[![Coverage Status](https://coveralls.io/repos/github/abernier/ssrr/badge.svg?branch=master)](https://coveralls.io/github/abernier/ssrr?branch=master)

# SSRR -- ServerSideReactRendering

```js
const ssr = require('ssrr')

require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    [ "transform-require-ignore", {"extensions": [".css"]} ]
  ]
});

const App = require('./src/App.js').default
const routes = Object.values(require('./src/routes.js').default)

const server = ssr(`${__dirname}/build`, App, routes)

const port = 5000
server.listen(port, () => console.log(`ok, ssrr is now listening on port ${port}`))
```

# NPM

To release a new version on [npm](https://www.npmjs.com/package/ssrr), create [a new realese](https://github.com/abernier/ssrr/releases/new) and wait for the [ci/cd](https://github.com/abernier/ssrr/actions?query=workflow%3Aci%2Fcd) publish it :)
