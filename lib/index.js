const fs = require('fs')
const path = require('path')

const http = require('http')
const zlib = require('zlib')

const express = require('express')

const httpProxy = require('http-proxy')
const isReachable = require('is-reachable')

const React = require('react')
const { renderToString } = require('react-dom/server')
const { StaticRouter, matchPath } = require('react-router-dom')
const serialize = require('serialize-javascript')

async function patchCra(index_html, App, route, url) {
  console.log(`Patching for ${url}`)

  const activeRoute = route || {}

  let data
  if (activeRoute.route && activeRoute.route.component && 'fetchInitialData' in activeRoute.route.component) {
    data = await activeRoute.route.component.fetchInitialData()
  }
    
  const context = {data}

  // const element = <StaticRouter location={url} context={context}>
  //   <App {...context} />
  // </StaticRouter>;
  const element = React.createElement(
    StaticRouter,
    {location: url, context: context},
    React.createElement(App, context)
  )

  const markup = renderToString(element)
  console.log('markup to inject:', markup)
  
  return index_html.replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div><script>window.__CONTEXT__ = ${serialize(context)}</script>`
  )
}

function ssrr(buildPath, App, routes, target = 'http://localhost:3000') {

  //
  // Proxy server
  //

  const proxy = new httpProxy.createProxyServer({target});

  //
  // Express app
  //

  const app = express()

  app.use(async function (req, res, next) {
    try {
      const reachable = await isReachable(target)

      if (reachable) {
        console.log('🌎', req.url) // serving from dev-server
        req.reactDevServerOn = true;
      } else {
        console.log('📁', req.url)
        req.reactDevServerOn = false; // serving from build/ folder
      }

      next();
    } catch(err) {next(err)}
  })

  // /:any_route -> serve index.html markup (proxy or build) patched
  app.use(async function (req, res, next) {
    try {
      //
      // find a route that matches `req.url`: if none -> serve file (next middleware)
      //

      const route = routes.find(({route}) => matchPath(req.url, route));
      if (!route) {
        // console.log('no matching route for ', req.url)
        return next(); // -> serve file
      }

      async function patch(html) {
        const newHtml = await patchCra(html, App, route, req.url);
        console.log('patched HTML: ', newHtml)

        return newHtml;
      }

      if (req.reactDevServerOn) {
        //
        // Proxy
        //
        //   - grab the index.html from http://localhost:3000
        //   - patch it
        //

        proxy.once('proxyRes', function (proxyRes, req, res) {
          let originalBody = [];
          proxyRes.on('data', chunk => originalBody.push(chunk))

          proxyRes.on('end', async function () {
            try {
              let finalBody = Buffer.concat(originalBody)

              //
              // unzip if gzipped (in order to be able to patch the body)
              //
              if (req.headers["accept-encoding"].includes('gzip') && finalBody.length > 0) {
                finalBody = zlib.gunzipSync(finalBody)
              }

              // patch <div id="root">
              finalBody = await patch(finalBody.toString('utf8'))
              
              res.end(finalBody);
            } catch(err) {next(err)}
          });
        });

        proxy.web(req, res, {target, selfHandleResponse: true});
      } else {
        //
        // build/
        //
        //   - grab the index.html from build/ folder
        //   - patch it
        //

        const indexHtml = fs.readFileSync(path.resolve(buildPath, './index.html'), 'utf-8')
        // console.log('indexHtml', indexHtml)

        const newbody = await patch(indexHtml)
        
        res.send(newbody)
      }
    } catch(err) {next(err)}
  })

  // any other -> serve the file (from proxy or build)
  app.use(function (req, res, next) {
    if (req.reactDevServerOn) {
      //console.log(`serving from proxy`)
      proxy.web(req, res);
    } else {
      //console.log(`serving from build folder`)
      express.static(buildPath)(req, res, next)
    }
  })

  //
  // HTTP server (based on app)
  //

  const server = http.createServer(app);
  
  // Listen to the `upgrade` event and proxy the WebSocket requests as well.
  server.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });


  server.app = app; // expose Express app

  return server;
};

module.exports = ssrr