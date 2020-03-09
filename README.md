[![Build Status](https://github.com/abernier/react-ssr/workflows/ci/cd/badge.svg)](https://github.com/abernier/react-ssr/actions?query=workflow%3Aci%2Fcd)

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