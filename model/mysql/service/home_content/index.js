var model = require('./model')
var SchemaParents = require('../../common/schemaParent')
var store = require('../../store')
var TABLE = model.table
var VIEW = model.view
var _schema = model.schema

class Base extends SchemaParents {
    constructor () {
        super(_schema, TABLE, VIEW)
    }

    setData(data) {
        super.mapDataToSchema(data)
    }

    save(cb) {
        super.save(cb)
    }

    update(cb) {
        super.update(cb)
    }

    grid(params, cb) {
        // Todo:
    }
}

module.exports = Base