[![Build Status](https://github.com/abernier/ssrr/workflows/ci/cd/badge.svg)](https://github.com/abernier/ssrr/actions?query=workflow%3Aci%2Fcd)
[![NPM version](https://img.shields.io/npm/v/ssrr.svg?style=flat)](https://www.npmjs.com/package/ssrr)
![David](https://img.shields.io/david/abernier/ssrr)
[![Coverage Status](https://coveralls.io/repos/github/abernier/ssrr/badge.svg?branch=master)](https://coveralls.io/github/abernier/ssrr?branch=master)

# SSRR -- ServerSideReactRendering

SSRR is a backend express server, that will render your React App server-side.

# Usage

1. `yarn build` or `yarn start` your [CRA](https://create-react-app.dev/)
   ```sh
   $ yarn start
   ```
2. Start the backend server:
   ```sh
   $ node server.js
   ```
    ```js
    // server.js
    
    const ssrr = require('ssrr')

    require("@babel/register")({
      presets: ["@babel/preset-env", "@babel/preset-react"],
      plugins: [
        [ "transform-require-ignore", {"extensions": [".css"]} ]
      ]
    });

    const App = require('./src/App.js').default
    const routes = Object.values(require('./src/routes.js').default)

    const server = ssrr(App, routes, {
      buildPath: `${__dirname}/build`,
      target: 'http://localhost:3000',
      rootSelector: '#root'
    })

    const port = 5000
    server.listen(port, () => console.log(`ok, ssrr is now listening on port ${port}`))
    ```
3. go to http://localhost:5000

NB: if you're using `yarn start` on 1., you still have hot-reload on port 5000 :)

# NPM

To release a new version on [npm](https://www.npmjs.com/package/ssrr):
1. bump the [`package.json` version](https://github.com/abernier/ssrr/edit/master/package.json)
2. then, create [a new realese](https://github.com/abernier/ssrr/releases/new) and wait for the [ci/cd](https://github.com/abernier/ssrr/actions?query=workflow%3Aci%2Fcd) publish it :)
