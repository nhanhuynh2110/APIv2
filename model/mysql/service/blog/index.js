var model = require('./model')
var SchemaParents = require('../../common/schemaParent')
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

  grid (obj, cb) {
    if (obj.isTab && parseInt(obj.isTab) < 2) {
      this.filterGridColumns({ is_delete: obj.isTab })
      this.filterGridCompareColumns({ blog_status: ` >= 1 ` })
    } else if (parseInt(obj.isTab) === 2) { // personal
      this.filterGridColumns({ account_code: obj.userCode, is_delete: 0 })
    } else if (parseInt(obj.isTab) === 3) {
      this.filterGridColumns({ account_code: obj.userCode, is_delete: 1 })
    } else if (parseInt(obj.isTab) === 4) {
      this.filterGridColumns({ account_code: obj.userCode, blog_status: 2, is_delete: 0 })
    } else if (parseInt(obj.isTab) === 5) {
      this.filterGridColumns({ account_code: obj.userCode, blog_status: 3, is_delete: 0 })
    }
    this.gridCommon(obj, (err, result) => {
      if (err) return cb(err)
      return cb(null, result)
    })
  }
}

module.exports = Base
