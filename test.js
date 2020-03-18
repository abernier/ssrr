const {promisify} = require('util');

const tap = require('tap');
const request = promisify(require('request'));
const exec = require('child_process').execSync

const ssr = require('./lib');

require("@babel/register")({
  presets: ["@babel/preset-env", "@babel/preset-react"],
  plugins: [
    [ "transform-require-ignore", {"extensions": [".css"]} ]
  ]
});
const App = require('./src/App.js').default
const routes = Object.values(require('./src/routes.js').default)

let server;
const port = 5000

const HOST = 'http://localhost:5000'

// ######  ######## ######## ##     ## ########  
// ##    ## ##          ##    ##     ## ##     ## 
// ##       ##          ##    ##     ## ##     ## 
//  ######  ######      ##    ##     ## ########  
//       ## ##          ##    ##     ## ##        
// ##    ## ##          ##    ##     ## ##        
//  ######  ########    ##     #######  ##        

// const {stdout, stderr}  = exec(`yarn build`);

tap.beforeEach(function (done) {
  console.log('beforeEach')

  server = ssr(`${__dirname}/build`, App, routes)
  server.listen(port, () => {
    console.log(`ok, server is now listening on port ${port}`)
    done()
  })
})

tap.afterEach(function (done) {
  console.log('afterEach')

	server.close(done)
})

// ######   ######## ##    ## ######## ########     ###    ##       
// ##    ##  ##       ###   ## ##       ##     ##   ## ##   ##       
// ##        ##       ####  ## ##       ##     ##  ##   ##  ##       
// ##   #### ######   ## ## ## ######   ########  ##     ## ##       
// ##    ##  ##       ##  #### ##       ##   ##   ######### ##       
// ##    ##  ##       ##   ### ##       ##    ##  ##     ## ##       
//  ######   ######## ##    ## ######## ##     ## ##     ## ######## 

tap.test('build folder', async t => {
  t.plan(2)

  let body

  //
  // HOME
  //

  resp = await request({
    method: 'GET',
    uri: `${HOST}/`
  });

  t.ok(/Hi.*sexy.*!/.test(resp.body), 'home ok')

  //
  // ABOUT
  //

  resp = await request({
    method: 'GET',
    uri: `${HOST}/about`
  });

  t.ok(resp.body.includes('About'), 'about ok')
})