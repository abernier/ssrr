const ssr = require('./lib')

require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    [ "transform-require-ignore", {"extensions": [".css"]} ],
    // "@babel/plugin-transform-runtime" // async/await support (see: https://babeljs.io/docs/en/babel-plugin-transform-runtime)
    // "@babel/plugin-proposal-optional-chaining"
  ]
});

const App = require('./src/App.js').default
const routes = Object.values(require('./src/routes.js').default)

const server = ssr(App, routes, {
  buildPath: `${__dirname}/build`,
  target: 'http://localhost:3000',
  rootSelector: '#root'
})

const port = 5000
server.listen(port, () => console.log(`ok, server is now listening on port ${port}`))
