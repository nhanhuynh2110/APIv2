var model = require('./model')
var SchemaParents = require('../../common/schemaParent')
// var store = require('../../store')
const TABLE = model.table
const VIEW = model.view
const _schema = model.schema

class Base extends SchemaParents {
  constructor () {
    super(_schema, TABLE, VIEW)
  }

  setData (data) {
    super.mapDataToSchema(data)
  }

  save (cb) {
    super.save(cb)
  }

  update (cb) {
    super.update(cb)
  }

  grid (params, cb) {
    // Todo:
  }
}

module.exports = Base
