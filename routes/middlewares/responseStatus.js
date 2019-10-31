// const error = require('./error')
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
      OK (data) { return res.status(status.OK).json({status: status.OK, message: 'success', data}) },
      created (data) { return res.status(status.CREATED).json({status: status.CREATED, message: '', data}) },
      badRequest (message) {
        return res.status(status.BAD_REQUEST).json({status: status.BAD_REQUEST, message: message || 'Bad Request'})
      },
      conflict () {
        return res.status(status.CONFLICT).json({status: status.CONFLICT, message: 'Type of request data is different to type of resource'})
      },
      serverError (err) { return res.status(status.SERVER_ERROR).json({status: status.SERVER_ERROR, message: err.toString()}) },
      forbidden () {
        return res.status(status.FORBIDDEN).json({ status: status.FORBIDDEN, message: 'You don\'t have permission to access this resource' })
      },
      notFound () {
        return res.status(status.NOT_FOUND).json({ status: status.NOT_FOUND, message: 'The resource is not existed or be deleted' })
      },
      methodNotAllowed (method, allowed) {
        if (allowed) res.setHeader('Allow', allowed)
        return res.status(status.METHOD_NOT_ALLOWED).json({ status: status.METHOD_NOT_ALLOWED, message: `Method ${method} Not Allowed` })
      },
      noContent () { return res.status(status.NO_CONTENT).end() }
    }
  }
}
