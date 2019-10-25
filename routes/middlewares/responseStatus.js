const error = require('./error')
const status = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  SERVER_ERROR: 500
}

module.exports = {
  status,
  methods: res => {
    return {
      OK (data) { return res.status(status.OK).json(data) },
      created (data) { return res.status(status.CREATED).json(data) },
      badRequest (message) {
        return res.status(status.BAD_REQUEST).json(error({ message: message || 'Bad Request' }, status.BAD_REQUEST))
      },
      conflict () {
        return res.status(status.CONFLICT).json(error({ message: 'Type of request data is different to type of resource' }, status.CONFLICT))
      },
      serverError (err) { return res.status(status.SERVER_ERROR).json(error(err)) },
      forbidden () {
        return res.status(status.FORBIDDEN).json(error({ message: 'You don\'t have permission to access this resource' }, status.FORBIDDEN))
      },
      notFound () { return res.status(status.NOT_FOUND).json(error({ message: 'The resource is not existed or be deleted' }, status.NOT_FOUND)) },
      methodNotAllowed (method, allowed) {
        if (allowed) res.setHeader('Allow', allowed)
        return res.status(status.METHOD_NOT_ALLOWED).json(error({ message: `Method ${method} Not Allowed` }))
      },
      noContent () { return res.status(status.NO_CONTENT).end() }
    }
  }
}
