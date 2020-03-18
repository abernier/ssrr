exports.getSSRContext = function (componentInstance) {
  //
  // Retrieve context, either from:
  //   1. the `staticContext` prop from `<StaticRouter>` (if executed from server)
  //   2. the `window.__CONTEXT__` value (if executed from browser -- after initial render)
  //

  let ret;

  const {staticContext} = componentInstance.props
  if (staticContext) {
    // 1. SSR
    ret = staticContext
  } else {
    // 2. Browser
    if (window.__CONTEXT__) {
      // with SRR context
      ret = window.__CONTEXT__
    } else {
      // without (CRA)
      ret = undefined
    }
  }

  return ret;
}