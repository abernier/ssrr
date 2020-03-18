exports.getContext = function (componentInstance) {
  let ret;

  const {staticContext} = componentInstance.props
  if (staticContext) {
    // SSR
    ret = staticContext
  } else {
    // Browser
    if (window.__CONTEXT__) {
      // with SRR context
      ret = window.__CONTEXT__
    } else {
      // without (CRA)
    }
  }

  return ret;
}