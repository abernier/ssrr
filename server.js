const ssr = require('./lib')

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
server.listen(port, () => console.log(`ok, server is now listening on port ${port}`))