const { methods } = require('./responseStatus')

module.exports = handler => (req, res, next) => {
  // res.setHeader('content-type', 'application/vnd.api+json')
  // res.setHeader('Accept', 'application/vnd.api+json')
  // res.header(
  //   'Access-Control-Allow-Headers',
  //   'Origin, Accept, Content-Type, Authorization'
  // )

  if (req.method === 'OPTIONS') {
    return res.OK()
  }

  const addedInMethods = methods(res)
  Object.keys(addedInMethods).forEach(fname => {
    res[fname] = addedInMethods[fname]
  })

  if (!handler) return next()

  const { method } = req
  const resolver = handler[method]
  if (!resolver) {
    res.methodNotAllowed(method, Object.keys(handler))
    return
  }
  return handler[method](req, res)
}
